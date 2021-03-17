const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const { body, param, validationResult } = require('express-validator');

module.exports = [

    param('id', 'Please provide a valid comment id')
        .isMongoId().bail()
        .custom(async id => {
            try {
                if (!await Comment.findById(id))
                    return Promise.reject("Comment doesn't exist");
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('post', 'Please provide valid post id')
        .trim()
        .optional()
        .isMongoId().bail()
        .custom(async id => {
            try {
                if (!await Post.findById(id))
                    return Promise.reject("Post doesn't exist");
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('name', "Please enter a name for comment's user")
        .trim(),

    body('text', 'Please enter a comment')
        .trim(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const { name, text, post } = req.body;
        const newData = { name, text, post };

        const comment = await Comment.findByIdAndUpdate(req.params.id, newData, { new: true }).catch(next);
        res.json(comment);
    },
];