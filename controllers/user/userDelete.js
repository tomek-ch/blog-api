const User = require('../../models/User');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { param, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');
const bcrypt = require('bcryptjs');

module.exports = [

    auth,

    param('id', 'Invalid user id')
        .isMongoId().bail()
        .custom(async (id, { req }) => {
            try {
                const user = await User.findById(id);
                if (!await bcrypt.compare(req.body.password, user.password))
                    return Promise.reject('Password is incorrect');
            } catch (e) {
                return Promise.reject('There was a network error');
            }
        }),

    async (req, res, next) => {
        
        if (req.params.id !== req.user._id.toString())
            return res.sendStatus(403);

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        try {
            const usersPosts = (await Post.find({ user: req.params.id })).map(post => post._id);
            const [deletedUser] = await Promise.all([
                User.findByIdAndDelete(req.params.id),
                Post.deleteMany({ author: req.params.id }),
                ...usersPosts.map(post => Comment.deleteMany({ post })),
            ]);

            res.json(deletedUser);
        } catch (e) {
            next(e);
        }
    },
];