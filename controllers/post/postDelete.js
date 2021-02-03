const Post = require('../../models/Post');
const { param, validationResult } = require('express-validator');

module.exports = [

    param('id', 'Invalid post id')
        .isMongoId(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json([errors[0].msg]);

        res.json(await Post.findByIdAndDelete(req.params.id));
    },
];