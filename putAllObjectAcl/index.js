const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.CONFIG_KEY_ID,
    secretAccessKey: process.env.CONFIG_ACCESS_KEY,
    region: process.env.CONFIG_REGION,
});

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    endpoint: new AWS.Endpoint(process.env.CONFIG_NCP_ENDPOINT),
});

const paramsForObjectList = {
  Bucket: process.env.BUCKET_NAME
};  

s3.listObjectsV2(paramsForObjectList, function(err, data) {
  if (err) {
    console.log("Error listing objects: ", err);
  } else {
    const list = data.Contents.map(function(object) {
        return object.Key;
    });

    list.map((item) => {
        const paramsForACL = {
            Bucket: process.env.BUCKET_NAME,
            Key: item,
            ACL: 'public-read'
        };

        s3.putObjectAcl(paramsForACL, function(err, data) {
            if (err) {
              console.log("Error setting object ACL: ", err);
            } else {
              console.log("Object ACL set successfully");
            }
        });
    });
  }
});