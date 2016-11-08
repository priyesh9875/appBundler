var mv = require('mv');
var express = require('express');
var path = require('path');
var webpack = require('webpack-stream');
var bodyParser = require('body-parser');
var zipper = require("zip-local");
var copy = require('copy');
const del = require('del');
const fs = require('fs');

const AWS = require('aws-sdk');
AWS.config.update({
    region: "ap-south-1",
    endpoint: "https://dynamodb.ap-south-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "appBundlerUsers1";

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
							//console.log("saved successfully !");
							fs.stat(filename, (err, stats) => {
								// console.log(stats);
								if (err) {
									res.status(500).send("File attribute error");
								} else {

									mv(filename, 'zipFiles/usersFiles/' + filename, (err) => {
										if (!err) {
											console.log(err)
											return;
										}

										docClient.get(
											{
												TableName: table,
												Key: { username: username }
											}, (err, userData) => {
												if (err) {
													res.status(500).send("User data search error");
												} else {
													//console.log(userData);
													userData.Item.zipFiles.push({
														name: filename,
														path: "zipFiles/usersFiles/" + filename,
														size: stats.size
													})

													docClient.update({
														TableName: table,
														Key: {
															username: username
														},
														UpdateExpression: "SET zipFiles = :zipFiles",
														ExpressionAttributeValues: {
															":zipFiles": userData.Item.zipFiles
														},
														ReturnValues: "ALL_NEW"
													}, (err, updateData) => {
														if (err) {
															status.status(500).send("Update error");
														} else {
															res.status(200).send(Object.assign(userData.Item, { filesList: allFilesList }));

														}
													})
												}
											})
									});
								}
							});

						}
					});
				}
			});
		});
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

		docClient.scan(scanTable, function (err, userData) {
			if (err) {
				console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
				res.status(500).send("Database scan error");
			} else {
				// finding in userData
				var found = false;
				userData.Items.map(value => {
					if (value.username == username) {
						found = true;
						console.log("Old user %s", username);
						res.status(200).send(Object.assign({}, value, { filesList: allFilesList }));
					}
				});

				if (!found) {
					// No user found
					// console.log("No use found");
					var user = {
						name: username.split('@')[0],
						id: userData.Count + 1,
						username: username,
						password: password,
						zipFiles: [],
					};


					var params = {
						TableName: table,
						Item: user
					};

					// console.log("Adding a new item...");
					docClient.put(params, function (err, insertedUser) {
						if (err) {
							console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
							res.status(500).send("Register error");
						} else {
							console.log("New user with username: %s", username);
							res.status(200).send(Object.assign({}, user, { filesList: allFilesList }));
						}
					});
				}
			}
		});

	} else {
		res.status(402).send();
	}

});

server.get('/app/download', (req, res) => {

	if (!req.query.filePath) {
		res.status(404).send("No file specified!")
	} else {
		var filePath = "./" + req.query.filePath;
		console.log(filePath)

		fs.stat(filePath, (err, stat) => {
			if (err) {
				res.status(404).send("File not found!")
			} else {
				res.download(filePath);
			}
		})
	}

})


server.post('/app/deleteFile', (req, res) => {

	var filePath = req.body.filePath;
	var username = req.body.username;
	var password = req.body.password;

	if (!username || !password || username !== password) {
		res.status(401).send("Unauthorized access");
		return;
	}

	if (!filePath) {
		res.status(404).send("No file specified!");
		return;
	}

	fs.stat(filePath, (err, stat) => {
		if (err) {
			res.status(404).send("File not found!")
			return;
		}
		var params = {
			TableName: table,
			Key: {
				username: username
			}
		};

		docClient.get(params, function (err, userData) {
			if (err) {
				res.status(500).send("Contact Delete error");
				return;
			}

			var index = -1;

			for (var i = 0; i < userData.Item.zipFiles.length; i++) {
				if (userData.Item.zipFiles[i].path = filePath) {
					userData.Item.zipFiles.splice(i, 1)
					index = i;
					break;
				}
			}

			if (index == -1) {
				res.status(200).send("already deleted from database. I dont know about server storage")
				return;
			}

			docClient.update({
				TableName: table,
				Key: {
					username: username
				},
				UpdateExpression: "SET zipFiles = :zipFiles",
				ExpressionAttributeValues: {
					":zipFiles": userData.Item.zipFiles
				},
				ReturnValues: "ALL_NEW"
			}, (err, updateData) => {
				if (err) {
					status.status(500).send("Update error");
					return;
				} else {
					fs.unlink(filePath, (err) => {
						if (err) {
							return;
						} else {
							res.status(200).send(Object.assign(userData.Item, { filesList: allFilesList }));
							return;
						}
					})
				}
			})
		});
	})
})


server.get('/*', (req, res) => {
	res.sendFile(path.resolve(__dirname, "src/index.html"));
})

server.listen(9875, () => {
	console.log("Listening on http://localhost:9875")
})


