var AWS = require("aws-sdk");
var fs = require("fs");


fs.readdir("./zipFiles/usersFiles/", (err, files) => {
    for (file in files) {
        console.log(files[file]);
    }
})

AWS.config.update({
    region: "ap-south-1",
    endpoint: "https://dynamodb.ap-south-1.amazonaws.com"
});

/*
user {
	username: string
	password: string
	id: string
	name: string
	zipFiles: {}
}


*/
var docClient = new AWS.DynamoDB.DocumentClient();

var table = "appBundlerUsers1";



var params = {
    TableName: table,
    ProjectionExpression: "zipFiles",
    Key: {
        username: "priyesh@gmail.com"
    }
};

// console.log("Adding a new item...");
docClient.get(params, function (err, data) {
    if (err) {
        console.error("Unable to query item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query item:", JSON.stringify(data, null, 2));
    }
});