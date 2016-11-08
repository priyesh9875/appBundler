var AWS = require('aws-sdk'),
    fs = require('fs');

AWS.config.update({
    region: "ap-south-1",
    endpoint: "https://s3.ap-south-1.amazonaws.com/",
    signatureVersion: 'v4'
});

var s3 = new AWS.S3();

module.exports = {
    putObject: function (bucket, filename, key, successCall, errCall) {
        fs.readFile(filename, function (err, data) {
            if (err) { throw err; }

            var base64data = new Buffer(data, 'binary');

            s3.putObject({
                Bucket: bucket,
                Key: key,
                ACL: 'public-read',
                Body: base64data
            }, function (err, res) {
                if (err) {
                    if (errCall)
                        errCall(err);
                } else {
                    if (successCall)
                        successCall(res)
                }
            })
        })
    },

    deleteObject: function (bucket, key, successCall, errCall) {
        s3.deleteObject({
            Bucket: bucket,
            Key: key,
        }, function (err, res) {
            if (err) {
                if (errCall)
                    errCall(err);
            } else {
                if (successCall)
                    successCall(res)
            }
        })
    },
}
