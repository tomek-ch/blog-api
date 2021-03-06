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

        const post = await Post
            .findById(req.params.id)
            .populate('author')
            .catch(next);

        if (!post) res.status(404);
        res.json(post);
    },
];