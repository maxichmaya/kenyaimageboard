var spicedPg = require("spiced-pg");

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    var db = spicedPg("postgres:postgres:curry@localhost:5432/imageboard");
}

exports.showImages = function showImages() {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC LIMIT 12`);
};

exports.getMoreImages = lastId => db.query(
        `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 12`,
        [lastId]
    ).then(
        ({rows}) => rows);
// };

exports.newImage = function newImage(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING url, title, id`,
        [url, username, title, description]
    );
};

exports.photoId = function photoId(id) {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

exports.commentsAreIn = function commentsAreIn(users, comments, imageid) {
    return db.query(
        `INSERT INTO comments (users, comments, imageid) VALUES ($1, $2, $3) RETURNING *`,
        [users, comments, imageid]
    );
};

exports.showComments = function showComments(imageid) {
    return db.query(
        `SELECT * FROM comments WHERE imageid=$1 ORDER BY created_at DESC`,
        [imageid]
    );
};
