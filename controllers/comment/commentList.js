const Comment = require('../../models/Comment');

module.exports = async (req, res, next) => {
    try {
        const { comment, author } = req.query;
        const comments = await Comment.find({ comment, author })
            .populate('author')
            .populate('comment');

        return res.json(comments);
    } catch (e) {
        return next(e);
    }
};