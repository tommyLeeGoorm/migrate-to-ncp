const AWS = require('aws-sdk');
const fs = require('fs');
const newsacCors = require('./newsacCors.js');
const staticCors = require('./staticCors.js');
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

const bucketName = 'TARGET-BUCKET-NAME';

s3.putBucketCors(newsacCors.data, (err, data) => {
    if (err) {
        console.error('putBucketCors fail:', err);
    } else {
        s3.getBucketCors({ Bucket: bucketName }, (err, data) => {
            if (err) {
                console.error('getBucketCors fail:', err);
            } else {
                console.log('getBucketCors success:', JSON.stringify(data));
            }
        });
    }
});