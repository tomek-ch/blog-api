const auth = require('../../middleware/authenticate');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');

module.exports = [

    auth,

    body('title', 'Please enter a title')
        .trim()
        .isLength({ min: 1 })
        .isLength({ max: 50 }).withMessage('Max length for post title is 50 characters'),

    body('excerpt', 'Please provide an excerpt')
        .trim()
        .isLength({ min: 1, max: 200 }),

    body('tags', 'There can be 5 tags max')
        .isArray({ max: 5 })
        .optional(),

    body('tags.*', "Tags can't be longer than 20 characters")
        .trim()
        .isLength({ max: 20 }),

    body('paragraphs', 'Please provide at least one paragraph')
        .isArray().bail()
        .isLength({ min: 1 }),

    body('paragraphs.*.body', "Paragraph body can't be empty")
        .trim()
        .isLength({ min: 1 }),

    body('paragraphs.*.heading', "Paragraph heading can't be longer than 50 characters")
        .trim()
        .isLength({ max: 1, max: 50 }),

    body('isPublished', 'Use a boolean value to determine whether a post is published')
        .isBoolean(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const { title, user, tags, paragraphs, isPublished, excerpt } = req.body;
        try {
            const data = { title, user, tags, paragraphs, isPublished, excerpt, author: req.user._id };
            data.timestamp = Date.now();
            const newPost = await new Post(data).save();
            return res.json(newPost);
        } catch (e) {
            return next(e);
        }
    },
];