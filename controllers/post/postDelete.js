const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const auth = require('../../middleware/authenticate');
const { ObjectId } = require('mongoose').Types;

module.exports = [

    auth,

    async (req, res, next) => {
        try {
            if (!ObjectId.isValid(req.params.id))
                return res.status(400).json(['Invalid comment id']);

            const post = await Post.findById(req.params.id);
            if (req.user._id.toString() !== post.author.toString())
                return res.sendStatus(403);
    
            const replyIds = (await Comment.find({ comment: req.params.id })).map(com => com._id);
    
            const [deletedPost] = await Promise.all([
                Post.findByIdAndDelete(req.params.id),
                Comment.deleteMany({ post: req.params.id }),
                Comment.deleteMany({ _id: { $in: replyIds } }),
            ]);
    
            res.json(deletedPost);
        } catch (e) {
            next(e);
        }
    },
];