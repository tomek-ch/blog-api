const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');
const { ObjectId } = require('mongoose').Types;

module.exports = [

    auth,

    body('post')
        .trim()
        .custom(async (post, { req }) => {
            try {

                const { comment } = req.body;
                if (!post && !comment)
                    return Promise.reject("Please provide a post or a comment that you're replying to");

                if (post) {
                    if (!ObjectId.isValid(post))
                        return Promise.reject('Invalid post id');
                    if (!await Post.findById(post))
                        return Promise.reject("Post doesn't exist");

                } else {
                    if (!ObjectId.isValid(comment))
                        return Promise.reject('Invalid comment id');
                    if (!await Comment.findById(comment))
                        return Promise.reject("Comment doesn't exist");
                }
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('text', 'Please enter a comment')
        .trim()
        .isLength({ min: 1 }),

    async (req, res, next) => {
        try {
            const errors = validationResult(req).array();
            if (errors.length)
                return res
                    .status(400)
                    .json(errors.map(err => err.msg));

            const { post, text, comment } = req.body;
            const data = {
                text,
                timestamp: Date.now(),
                author: req.user._id,
            };


            // Comment is a response to either a post or another comment
            if (req.body.post) {
                data.post = post;
            } else {
                data.comment = comment;
                await Comment.findByIdAndUpdate(comment, { $inc: { 'replyCount': 1 } });
            }

            const newComment = await new Comment(data).save();
            return res.json(newComment);
        } catch (e) {
            next(e);
        }
    },
];