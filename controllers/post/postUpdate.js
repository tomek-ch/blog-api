const User = require('../../models/User');
const Post = require('../../models/Post');
const { body, validationResult, param } = require('express-validator');

module.exports = [

    param('id', 'Invalid post id')
        .isMongoId(),

    body('title')
        .trim(),

    body('title', 'Please provide an excerpt')
        .trim(),

    body('user', 'Please provide a user')
        .trim()
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
        .isLength({ max: 5 })
        .optional(),

    body('paragraphs.*.*')
        .trim(),

    body('paragraphs', 'Please provide at least one paragraph')
        .isArray()
        .optional(),

    body('paragraphs.*.body', "Paragraph body can't be empty")
        .isLength({ min: 1 }),

    body('isPublished', 'Use a boolean value to determine whether a post is published')
        .isBoolean()
        .optional(),

    body('tags.*', "Tags can't be longer than 20 characters")
        .trim()
        .isLength({ max: 20 }),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const newData = ['title', 'user', 'tags', 'paragraphs', 'isPublished']
            .reduce((obj, field) => req.body[field] ? {
                [field]: req.body[field],
                ...obj,
            } : obj, {});

        if (req.body.isPublished === false) newData.isPublished = false;

        try {
            const post = await Post.findByIdAndUpdate(req.params.id, newData, { new: true });
            res.json(post);
        } catch (e) {
            next(e);
        }
    },
];