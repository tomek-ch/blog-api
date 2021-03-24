const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    body('post', 'Please provide a post')
        .trim()
        .isMongoId().bail()
        .custom(async id => {
            try {
                if (!await Post.findById(id))
                    return Promise.reject("Post doesn't exist");
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('text', 'Please enter a comment')
        .trim()
        .isLength({ min: 1 }),
    
    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));
        
        const { post, text } = req.body;
        const data = {
            post,
            text,
            timestamp: Date.now(),
            author: req.user._id,
        };

        const newComment = await new Comment(data).save().catch(next);
        res.json(newComment);
    },
];