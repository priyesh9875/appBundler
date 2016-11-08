var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
  endpoint: "https://dynamodb.ap-south-1.amazonaws.com"
});


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

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }

});
