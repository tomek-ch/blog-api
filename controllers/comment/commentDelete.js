const Comment = require('../../models/Comment');
const { param, validationResult } = require('express-validator');

module.exports = [

    param('id', 'Invalid comment id')
        .isMongoId(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json([errors[0].msg]);

        res.json(await Comment.findByIdAndDelete(req.params.id));
    },
];