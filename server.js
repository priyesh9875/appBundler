var express = require('express');
var path = require('path');
var webpack = require('webpack-stream');
var bodyParser = require('body-parser');
var zipper = require("zip-local");
var copy = require('copy');
const del = require('del');
const fs = require('fs');

var dynamodb = require('./dynamodb');
var storage = require('./storage');



var table = "appBundlerUsers1";
var bucket = "appbundler";

var allFilesList = [];
var dirFiles = fs.readdirSync("./zipFiles/src/")
for (file in dirFiles) {
	var obj = {}
	obj["path"] = "./zipFiles/src/" + dirFiles[file]
	obj["name"] = dirFiles[file]
	allFilesList.push(obj);
}

// Server
var server = express();

server.use(bodyParser.json());         // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

server.use(express.static(__dirname + '/src'));

server.post("/api/zip", (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	var filesList = req.body.filesList;
	var id = req.body.id;
	var milliseconds = (new Date).getTime();
	var filename = username + milliseconds + '.zip';

	del(['temp']).then((paths) => {
		copy.each(filesList, 'temp', function (err, files) {
			if (err) throw err;
			// `files` is an array of the files that were copied 
			zipper.zip("temp", function (error, zipped) {

				if (!error) {
					zipped.compress(); // compress before exporting

					var buff = zipped.memory(); // get the zipped file as a Buffer

					// or save the zipped file to disk
					zipped.save(filename, function (error) {
						if (!error) {
							console.log("saved successfully !");
							fs.stat(filename, (err, stats) => {
								// console.log(stats);
								if (err) {
									res.status(500).send("File attribute error");
								} else {

									storage.putObject("appbundler", filename, filename,
										(uploadRes) => {
											fs.unlink(filename, (err) => {
												if (err) {
													return;
												}
											})
											console.log("upload success: ", uploadRes)

											dynamodb.get({
												TableName: table,
												Key: { username: username }
											}, (userData) => {

												userData.Item.zipFiles.push({
													name: filename,
													path: "https://s3.ap-south-1.amazonaws.com/" + bucket + "/" + filename,
													size: stats.size
												})

												dynamodb.update({
													TableName: table,
													Key: {
														username: username
													},
													UpdateExpression: "SET zipFiles = :zipFiles",
													ExpressionAttributeValues: {
														":zipFiles": userData.Item.zipFiles
													},
													ReturnValues: "ALL_NEW"
												}, (updateSuccess) => {
													res.status(200).send(Object.assign(userData.Item, { filesList: allFilesList }));
													return;

												}, (updateError) => {
													res.status(500).send("Update error");
													return;
												})
											})
										}, (uploadError) => {
											res.status(500).send("S3 put error ");
											return;
										}
									)
								}
							})
						}
					})
				}
			})
		})
	})
})



server.post('/api/login', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;

	var scanTable = {
		TableName: table,
	};

	if (!username || !password) {
		res.status(401).send();
	} else if (username === password) {

		dynamodb.scan(scanTable,
			(successScan) => {

				var found = false;
				successScan.Items.map(value => {

					if (value.username == username) {
						found = true;
						console.log("Old user %s", username);
						res.status(200).send(Object.assign({}, value, { filesList: allFilesList }));
						return;
					}
				})

				if (!found) {
					// No user found
					// console.log("No use found");
					var user = {
						name: username.split('@')[0],
						id: successScan.Count + 1,
						username: username,
						password: password,
						zipFiles: [],
					};

					var params = {
						TableName: table,
						Item: user
					};

					// console.log("Putting new item");
					dynamodb.put(params, (successPut) => {
						console.log("New user with username: %s", username);
						res.status(200).send(Object.assign({}, user, { filesList: allFilesList }));

					}, (errorPut) => {
						console.error("Unable to add item. Error JSON:", JSON.stringify(errorPut, null, 2));
						res.status(500).send("Register error");
					})

				}
			},
			(errorScan) => {
				if (err) {
					console.error("Unable to scan Error JSON:", JSON.stringify(err, null, 2));
					res.status(500).send("Database scan error");
					return;
				}
			})
	} else {
		res.status(402).send();
	}

});

server.post('/app/deleteFile', (req, res) => {

	var filename = req.body.filename;
	var username = req.body.username;
	var password = req.body.password;

	if (!username || !password || username !== password) {
		res.status(401).send("Unauthorized access");
		return;
	}

	if (!filename) {
		res.status(404).send("No file specified!");
		return;
	}

	var params = {
		TableName: table,
		Key: {
			username: username
		}
	};

	dynamodb.get(params, (successGet) => {
		var index = -1;
		for (var i = 0; i < successGet.Item.zipFiles.length; i++) {
			if (successGet.Item.zipFiles[i].name = filename) {
				successGet.Item.zipFiles.splice(i, 1)
				index = i;
				break;
			}
		}

		if (index == -1) {
			res.status(200).send("Already deleted from database. I dont know about server storage")
			return;
		}

		storage.deleteObject(bucket, filename,
			(successDelete) => {
				console.log("Delete from storage: " + filename);
				dynamodb.update({
					TableName: table,
					Key: {
						username: username
					},
					UpdateExpression: "SET zipFiles = :zipFiles",
					ExpressionAttributeValues: {
						":zipFiles": successGet.Item.zipFiles
					},
					ReturnValues: "ALL_NEW"
				},
					(successUpdate) => {
						res.status(200).send(Object.assign(successGet.Item, { filesList: allFilesList }));

					}, (errorUpdate) => {
						status.status(500).send("Delete Update error");
						return;
					})
			},
			(errorDelete) => {
				res.status(500).send("S3 delete error");
				return;
			});
	})
});

server.get('/*', (req, res) => {
	res.sendFile(path.resolve(__dirname, "src/index.html"));
})

server.listen(9875, () => {
	console.log("Listening on http://localhost:9875")
})


