const Post = require('../../models/Post');

module.exports = async (req, res, next) => {
    const { author, tags } = req.query;
    try {
        const posts = await Post
            .find({ author, tags, isPublished: true })
            .populate('author');
            
        return res.json(posts);
    } catch (e) {
        next(e);
    }
};