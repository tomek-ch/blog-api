const Comment = require('../../models/Comment');

module.exports = async (req, res, next) => {
    try {
        const { comment } = req.query;
        const comments = await Comment.find({ comment }).populate('author');
        res.json(comments);
    } catch (e) {
        next(e);
    }
};