const Post = require('../../models/Post');

module.exports = async (req, res, next) => {
    const { author } = req.query;
    try {
        const posts = author ? await Post.find({ author }) : await Post.find();
        res.json(posts);
    } catch (e) {
        next(e);
    }
};