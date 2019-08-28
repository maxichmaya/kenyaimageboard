const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
    // region: "eu-central-1"
});
// console.log("s3:", s3);
// console.log("secrets.AWS_KEY:", secrets.AWS_KEY);
// console.log("secrets.AWS_SECRET:", secrets.AWS_SECRET);

exports.upload = (req, res, next) => {
    const { file } = req;
    if (!file) {
        console.log("multer faild:");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "maksicbucket",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })

        .promise()
        .then(data => {
            console.log(data);
            next();
        })
        .catch(err => {
            console.log("err: ", err);
            res.sendStatus(500);
        });
};
