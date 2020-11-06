const mogoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path  = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const PostSchema = new mogoose.Schema({
    name: String,
    restriction: String,
    size: Number,
    key: String,
    url: String,
    type: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

PostSchema.pre('save', function() {
    if (!this.url) {
        this.url =  `${process.env.APP_URL}/files/${this.key}`;
    }
})

PostSchema.pre('remove', function() {
    if (process.env.STORAGE_TYPE === 's3') {
        return s3.deleteObject({
            Bucket: 'uploadsompo',
            Key: this.key,
        }).promise()
    } else {
        console.log('removendo' + this.key)
        return promisify(fs.unlink)(
            path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
         );
    }
})

module.exports = mogoose.model("Post", PostSchema);