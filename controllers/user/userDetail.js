const User = require('../../models/User');
const Post = require('../../models/Post');
const { param, validationResult } = require('express-validator');

module.exports = [

    param('id', 'Invalid user id')
        .isMongoId(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json([errors[0].msg]);

        const [user, posts] = await Promise.all([
            User.findById(req.params.id),
            Post.find({ author: req.params.id }),
        ]).catch(next);

        if (!user) res.status(404);
        res.json({ user, posts });
    },
];