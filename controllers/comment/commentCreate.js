const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');

module.exports = [

    body('post', 'Please provide a post')
        .trim()
        .isMongoId().bail()
        .escape()
        .custom(async id => {
            try {
                if (!await Post.findById(id))
                    return Promise.reject("Post doesn't exist");
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('name', "Please enter a name for comment's user")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('text', 'Please enter a comment')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));
        
        const { post, name, text } = req.body;
        const data = { post, name, text };
        data.timestamp = Date.now();

        const newComment = await new Comment(data).save().catch(next);
        res.json(newComment);
    },
];