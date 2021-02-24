const User = require('../../models/User');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');

module.exports = [

    body('title', 'Please enter a title')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('user', 'Please provide an user')
        .trim()
        .isMongoId().bail()
        .escape()
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
        .optional(),

    body('tags.*')
        .escape(),

    body('paragraphs', 'Please provide at least one paragraph')
        .isArray().bail()
        .isLength({ min: 1 }),

    body('paragraphs.*.body', "Paragraph body can't be empty")
        .isLength({ min: 1 }),

    body('paragraphs.*.*')
        .escape(),

    body('isPublished', 'Use a boolean value to determine whether a post is published')
        .isBoolean(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const { title, user, tags, paragraphs, isPublished } = req.body;
        try {
            const data = { title, user, tags, paragraphs, isPublished };
            data.timestamp = Date.now();
            const newPost = await new Post(data).save();
            res.json(newPost);
        } catch (e) {
            next(e);
        }
    },
];