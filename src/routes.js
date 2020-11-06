const routes = require('express').Router();
const express = require('express');
const multer = require('multer');
const multerConfig = require("./config/multer");

const Post = require('./models/Post');

routes.get("/posts", async (req, res) => {
    const posts = await Post.find();

    return res.json(posts);
})

routes.post("/posts", multer(multerConfig).single('file'), async (req, res) => {

    console.log(req);

    const { originalname: name, size, key, location: url, contentType: type} = req.file;
    const { restriction } = req.body;

    const post = await Post.create({
        name,
        restriction,
        size,
        key,
        url,
        type
    });

    return res.json(post);
});

routes.delete('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);

    await post.remove();

    return res.send();
})

routes.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);

    return res.json(post)
})

module.exports = routes;