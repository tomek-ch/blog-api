const Comment = require('../../models/Comment');
const { body, param, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Please provide a valid comment id')
        .isMongoId().bail()
        .custom(async (id, { req }) => {
            try {
                const comment = await Comment.findById(id);
                if (!comment)
                    return Promise.reject("Comment doesn't exist");
                if (comment.author.toString() !== req.user._id.toString())
                    return Promise.reject('Unauthorized');
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('text', 'Please enter a comment')
        .trim()
        .isLength({ min: 1 }),

    async (req, res, next) => {

        const errors = validationResult(req).array().map(err => err.msg);        
        if (errors.includes('Unauthorized'))
            return res.sendStatus(403);

        if (errors.length)
            return res
                .status(400)
                .json(errors);

        const { text } = req.body;

        const comment = await Comment.findByIdAndUpdate(req.params.id, { text }, { new: true }).catch(next);
        res.json(comment);
    },
];