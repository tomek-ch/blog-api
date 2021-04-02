const Comment = require('../../models/Comment');

module.exports = async (req, res, next) => {
    try {
        const { post } = req.query;
        const comments = await Comment.find({ post }).populate('author');
        res.json(comments);
    } catch (e) {
        next(e);
    }
};