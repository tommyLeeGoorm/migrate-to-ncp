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

const bucketName = 'TARGET-BUCKET-NAME';

const createBucketParams = {
    Bucket: bucketName,
    ACL: 'public-read', // private 비공개 || public 공개 
    CreateBucketConfiguration: {}
};

s3.createBucket(createBucketParams, (err, data) => {
    if (err) {
      console.error('bucket create fail:', err);
    } else {
      console.log('bucket create success');
    }
});