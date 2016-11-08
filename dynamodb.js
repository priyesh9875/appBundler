var AWS = require("aws-sdk");

AWS.config.update({
    region: "ap-south-1",
    endpoint: "https://dynamodb.ap-south-1.amazonaws.com"
});


var docClient = new AWS.DynamoDB.DocumentClient();
var table = "appBundlerUsers1";


module.exports = {
    scan: function (params, succCall, errCall) {
        docClient.scan(params, (err, data) => {
            if (err) {
                errCall(err);
            } else {
                succCall(data);
            }
        })
    },

    get: function (params, succCall, errCall) {
        docClient.get(params, (err, data) => {
            if (err) {
                errCall(err);
            } else {
                succCall(data);
            }
        })
    },
    put: function (params, succCall, errCall) {
        docClient.put(params, (err, data) => {
            if (err) {
                errCall(err);
            } else {
                succCall(data);
            }
        })
    },

    update: function (params, succCall, errCall) {
        docClient.update(params, (err, data) => {
            if (err) {
                errCall(err);
            } else {
                succCall(data);
            }
        })
    },








}


// var params = {
//     TableName: "appBundlerUsers1"
// }


// // console.log("Adding a new item...");
// docClient.scan(params, function (err, data) {
//     if (err) {
//         console.error("Unable to query item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Query item:", JSON.stringify(data, null, 2));
//     }
// });