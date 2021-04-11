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

            const [post, comments] = await Promise.all([
                Post.findById(req.params.id),
                Comment.find({ post: req.params.id }),
            ]);
            
            if (req.user._id.toString() !== post.author.toString())
                return res.sendStatus(403);

            const commentIds = comments.map(com => com._id);
    
            const [deletedPost] = await Promise.all([
                Post.findByIdAndDelete(req.params.id),
                Comment.deleteMany({ post: req.params.id }),
                // Delete replies to comments under post
                Comment.deleteMany({ comment: { $in: commentIds } }),
            ]);
    
            return res.json(deletedPost);
        } catch (e) {
            next(e);
        }
    },
];