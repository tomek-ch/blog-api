const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { param, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Invalid post id')
        .isMongoId(),

    async (req, res, next) => {

        const post = await Post.findById(req.params.id).catch(next);
        if (req.user._id.toString() !== post.author.toString())
            return res.sendStatus(403);

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json([errors[0].msg]);

        const [deletedPost] = await Promise.all([
            Post.findByIdAndDelete(req.params.id),
            Comment.deleteMany({ post: req.params.id }),
        ]).catch(next);

        res.json(deletedPost);
    },
];