const Comment = require('../../models/Comment');
const auth = require('../../middleware/authenticate');
const { ObjectId } = require('mongoose').Types;

module.exports = [

    auth,

    async (req, res, next) => {

        try {
            if (!ObjectId.isValid(req.params.id))
                return res.status(400).json(['Invalid comment id']);

            const comment = await Comment.findById(req.params.id);
            if (!comment)
                return res.json(null);

            if (req.user._id.toString() !== comment.author.toString())
                return res.sendStatus(403);

            const promises = [Comment.findByIdAndDelete(req.params.id)];
            if (comment.comment) {
                promises.push(Comment.findByIdAndUpdate(comment.comment, { $inc: { 'replyCount': -1 } }));
            } else {
                promises.push(Comment.deleteMany({ comment: req.params.id }));
            }
            
            const [deletedComment] = await Promise.all(promises);
            return res.json(deletedComment);
        } catch (e) {
            return next(e);
        }
    },
];