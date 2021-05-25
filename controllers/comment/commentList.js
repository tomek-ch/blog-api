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
            const { comment, author, getPost, newest } = req.query;
            const query = Comment.find({ comment, author })
                .sort({ timestamp: newest ? -1 : 1 })
                .populate('author')
                .populate('comment');

            const comments = getPost ? await query.populate('post') : await query;
            return res.json(comments);
            
        } catch (e) {
            return next(e);
        }
    },
];