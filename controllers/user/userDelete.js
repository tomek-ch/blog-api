const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { param, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Invalid user id')
        .isMongoId(),

    async (req, res, next) => {

        if (req.params.id !== req.user._id.toString())
            return res.sendStatus(403);

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json([errors[0].msg]);

        try {
            const usersPosts = (await Post.find({ user: req.params.id })).map(post => post._id);
            const [deletedUser] = await Promise.all([
                User.findByIdAndDelete(req.params.id),
                Post.deleteMany({ user: req.params.id }),
                ...usersPosts.map(post => Comment.deleteMany({ post })),
            ]).catch(next);

            res.json(deletedUser);
        } catch (e) {
            next(e);
        }
    },
];