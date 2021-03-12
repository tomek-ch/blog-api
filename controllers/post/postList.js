const Post = require('../../models/Post');

module.exports = async (req, res, next) => {
    const { user, tags } = req.query;
    try {
        const posts = await Post.find({ user, tags });
        res.json(posts);
    } catch (e) {
        next(e);
    }
};