const Post = require('../../models/Post');

module.exports = async (req, res, next) => {
    const { user } = req.query;
    try {
        const posts = user ? await Post.find({ user }) : await Post.find();
        res.json(posts);
    } catch (e) {
        next(e);
    }
};