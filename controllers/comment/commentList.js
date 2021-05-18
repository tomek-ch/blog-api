const Comment = require('../../models/Comment');
const { query, validationResult } = require('express-validator');

module.exports = [

    query('comment')
        .optional()
        .isMongoId(),

    query('author')
        .optional()
        .isMongoId(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        try {
            const { comment, author } = req.query;
            const comments = await Comment.find({ comment, author })
                .populate('author')
                .populate('comment');

            return res.json(comments);
        } catch (e) {
            return next(e);
        }
    },
];