const User = require('../../models/User');
const Post = require('../../models/Post');
const { body, validationResult, param } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Invalid post id')
        .isMongoId(),

    body('title')
        .trim()
        .optional()
        .isLength({ min: 1 }),

    body('title', 'Please provide an excerpt')
        .trim()
        .optional()
        .isLength({ min: 1 }),

    body('user', 'Please provide a user')
        .trim()
        .isLength({ min: 1 })
        .optional()
        .isMongoId().bail()
        .custom(async id => {
            try {
                if (!await User.findById(id))
                    return Promise.reject("User doesn't exist");
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('tags', 'Tags must be an array')
        .isArray()
        .isLength({ min: 1, max: 5 })
        .optional(),

    body('paragraphs.*.*')
        .trim()
        .optional(),

    body('paragraphs', 'Please provide at least one paragraph')
        .isArray()
        .isLength({ min: 1 })
        .optional(),

    body('paragraphs.*.body', "Paragraph body can't be empty")
        .isLength({ min: 1 }),

    body('isPublished', 'Use a boolean value to determine whether a post is published')
        .isBoolean()
        .optional(),

    body('tags.*', "Tags can't be longer than 20 characters")
        .trim()
        .isLength({ min: 1, max: 20 })
        .optional(),

    body('excerpt', 'Please provide an excerpt')
        .trim()
        .optional()
        .isLength({ min: 1, max: 200 }),

    async (req, res, next) => {

        const post = await Post.findById(req.params.id).catch(next);
        if (post.author.toString() !== req.user._id.toString())
            return res.sendStatus(403);

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const newData = ['title', 'user', 'tags', 'paragraphs', 'isPublished', 'excerpt']
            .reduce((data, field) => {
                const value = req.body[field];
                if (value !== undefined)
                    return { ...data, [field]: value };
                return data;
            }, {});

        try {
            const post = await Post.findByIdAndUpdate(req.params.id, newData, { new: true });
            res.json(post);
        } catch (e) {
            next(e);
        }
    },
];