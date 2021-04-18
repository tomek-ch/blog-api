const Post = require('../../models/Post');

module.exports = async (req, res, next) => {
    try {
        const { author, tags, title } = req.query;

        const options = {
            author,
            tags,
            title: title ? new RegExp(title, 'i') : undefined,
            isPublished: true,
        };

        const posts = await Post
            .find(options)
            .populate('author');

        return res.json(posts);
        
    } catch (e) {
        return next(e);
    }
};