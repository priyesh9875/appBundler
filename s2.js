var AWS = require("aws-sdk");

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
	zipFiles: List[ zip id]
}

zipFiles: {
	name: string
	path: string
	size: string
}

*/
var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "appBundlerUsers1",
    KeySchema: [       
        { AttributeName: "username", KeyType: "HASH"}  //Partition key

    ],
    AttributeDefinitions: [       
        { AttributeName: "username", AttributeType: "S" }
		
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    }
};


var files = {
    TableName : "appBundlerZipFiles1",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"}  //Partition key
    ],
    AttributeDefinitions: [       

		{ AttributeName: "id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    }
};


dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }

});dynamodb.createTable(files, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
