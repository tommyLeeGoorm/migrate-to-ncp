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

s3.listBuckets((err, data) => {
    if (err) {
        console.error('listBuckets fail:', err);
    } else {
        data.Buckets.forEach(bucket => {
            console.log(bucket);
        });
    }
});