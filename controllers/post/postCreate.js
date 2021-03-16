const auth = require('../../middleware/authenticate');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');

module.exports = [

    auth,

    body('title', 'Please enter a title')
        .trim()
        .isLength({ min: 1 }),

    body('excerpt', 'Please provide an excerpt')
        .trim()
        .isLength({ min: 1 }),

    body('tags', 'Tags must be an array')
        .isArray()
        .isLength({ max: 5 })
        .optional(),

    body('tags.*', "Tags can't be longer than 20 characters")
        .trim()
        .isLength({ max: 20 }),

    body('paragraphs.*.*')
        .trim(),

    body('paragraphs', 'Please provide at least one paragraph')
        .isArray().bail()
        .isLength({ min: 1 }),

    body('paragraphs.*.body', "Paragraph body can't be empty")
        .isLength({ min: 1 }),

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
            res.json(newPost);
        } catch (e) {
            next(e);
        }
    },
];