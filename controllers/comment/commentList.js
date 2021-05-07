const Comment = require('../../models/Comment');
const { ObjectId } = require('mongoose').Types;

module.exports = async (req, res, next) => {
    try {
        const { comment, author } = req.query;
        if (comment && !ObjectId.isValid(comment))
            return res
                .status(400)
                .json(['Invalid comment id']);

        const comments = await Comment.find({ comment, author })
            .populate('author')
            .populate('comment');

        return res.json(comments);
    } catch (e) {
        return next(e);
    }
};