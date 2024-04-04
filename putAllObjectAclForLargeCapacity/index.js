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

function getListingS3() {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: process.env.BUCKET_NAME,
      };
      // 전체 key값을 담을 배열 (결과 확인용)
      const allKeys = [];
      // 재귀함수로 전체 key값을 가져오면서 ACL 설정
      listAllKeys();

      function listAllKeys() {
        s3.listObjectsV2(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            let contents = data.Contents;
            const list = contents.map(function (object) {
              return object.Key;
            });

            list.map((item) => {
              const paramsForACL = {
                Bucket: process.env.BUCKET_NAME,
                Key: item,
                ACL: "public-read",
              };

              s3.putObjectAcl(paramsForACL, function (err, data) {
                if (err) {
                  console.log("Error setting object ACL: ", err);
                } else {
                  console.log("Object ACL set successfully");
                }
              });
            });

            if (data.IsTruncated) {
              params.ContinuationToken = data.NextContinuationToken;
              console.log("get further list...");
              listAllKeys();
            } else {
              resolve(allKeys);
            }
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

const totalList = getListingS3();

console.log("ACL set complete!")
console.log(totalList.length);
