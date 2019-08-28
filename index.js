// this means building a simple server

const express = require("express");
const app = express();
const db = require("./sql/db");
const s3 = require("./s3");
const config = require("./config");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static("./public"));

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/images", function(req, res) {
    db.showImages()
        .then(resp => {
            // console.log("resp: ", resp);
            res.json(resp);
        })
        .catch(function(err) {
            console.log("err in db.showImages: ", err);
        });
});

app.get("/bigImage/:id", (req, res) => {
    db.photoId(req.params.id)
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("err:", err);
        });
});

app.get("/moreimages/:id", (req, res) => {
    db.getMoreImages(req.params.id).then(data => {
        res.json(data);
    }).catch(err => {
        console.log("err", err);
    })
})
app.post("/comment/", (req, res) => {
    console.log(req.body);
    db.commentsAreIn(req.body.users, req.body.comments, req.body.imageid)
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("error in comments", err);
        });
});

app.get("/comment/:id", (req, res) => {
    console.log("Hello there:", req.params.id);
    db.showComments(req.params.id)
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("err:", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    const fullurl = config.s3Url + req.file.filename;
    db.newImage(
        fullurl,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then(resp => {
            console.log("resp:", resp);
            res.json(resp.rows[0]);
            fs.promises.unlink(req.file.path);
        })
        .catch(err => {
            console.log("err: ", err);
            res.sendStatus(500);
        });
}); //function closing

app.listen(8080, () => console.log("I will show you the images!"));
