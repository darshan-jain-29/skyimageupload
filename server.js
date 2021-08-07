// server.js
const aws = require('aws-sdk');
const express = require("express");
const multer = require("multer");
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const path = require('path');

const app = express();
const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4'
});

var newFileName = '';

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'skygroup',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            newFileName = ext + `${uuid()}${ext}`;
            console.log(newFileName)
            cb(null, `${uuid()}${ext}`);
        }
    })
})

app.listen(3001, () => {
    console.log(`Server started...`);
});

app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res) {
    // console.log(req.body);
    // console.log(req.files);

    return res.json({ status: 'OK', uploaded: req.files.length, fileName: req.files[0].key });
}
