const Post = require('../../models/Post');

module.exports = async (req, res, next) => {
    res.json(await Post.find().catch(next));
};