const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
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

// 변경 필요: 압축파일명
const localZipPath = './target.zip';

const localTempZipPath = 'temp';

// 변경 필요: 압축파일의 root 디렉토리명
const rootDirectory = 'root/';


fs.createReadStream(localZipPath)
  .pipe(unzipper.Extract({ path: localTempZipPath }))
  .on('finish', () => {
    uploadFilesInDirectory(localTempZipPath, '');
  });

function uploadFilesInDirectory(directoryPath, relativePath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      if (file === '.DS_Store' || file === '__MACOSX') {
        return;
      }

      const filePath = path.join(directoryPath, file);
      const relativeFilePath = path.join(relativePath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        if (stats.isDirectory()) {
          uploadFilesInDirectory(filePath, relativeFilePath);
        } else {
          const fileStream = fs.createReadStream(filePath);

          const convertedRealtiveFilePath = relativeFilePath.replace(rootDirectory, '');

          const uploadParams = {
            Bucket: bucketName,
            Key: convertedRealtiveFilePath, // 수정된 부분,
            Body: fileStream
          };

          s3.upload(uploadParams, (err, data) => {
            if (err) {
              console.error('Error uploading file:', err);
              return;
            }
            console.log('File uploaded successfully:', data.Location);
          });
        }
      });
    });
  });
}