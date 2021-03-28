const Comment = require('../../models/Comment');
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

    body('text', 'Please enter a comment')
        .trim()
        .isLength({ min: 1 }),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const { text } = req.body;
        const newData = {
            text,
            timestamp: Date.now(),
        };

        const comment = await Comment.findByIdAndUpdate(req.params.id, newData, { new: true }).catch(next);
        res.json(comment);
    },
];