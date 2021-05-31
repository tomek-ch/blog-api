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
                const user = await User.findById(id).select('+password');
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
            const getIds = arr => arr.map(item => item._id);

            const [userPostIds, userCommentIds] = await Promise.all([
                Post.find({ author: req.user._id })
                    .then(getIds),
                Comment.find({ author: req.user._id })
                    .then(getIds),
            ]);

            const [repliesToUserCommentIds, commentsUnderPostIds] = await Promise.all([
                Comment.find({ comment: { $in: userCommentIds } })
                    .then(getIds),
                Comment.find({ post: { $in: userPostIds } })
                    .then(getIds),
            ]);

            const repliesToCommentsUnderPostIds = await Comment
                .find({ comment: { $in: commentsUnderPostIds } })
                .then(getIds);

            const [deletedUser] = await Promise.all([
                User.findByIdAndDelete(req.user._id),
                Post.deleteMany({ author: req.user._id }),
                Comment.deleteMany({
                    _id: {
                        $in: [
                            ...userCommentIds,
                            ...repliesToUserCommentIds,
                            ...commentsUnderPostIds,
                            ...repliesToCommentsUnderPostIds,
                        ],
                    },
                }),
            ]);

            return res.json(deletedUser);
        } catch (e) {
            return next(e);
        }
    },
];