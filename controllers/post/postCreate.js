const Author = require('../../models/Author');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');

module.exports = [

    body('title', 'Please enter a title')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('author', 'Please provide an author')
        .trim()
        .isMongoId().bail()
        .escape()
        .custom(async id => {
            try {
                if (!await Author.findById(id))
                    return Promise.reject("Author doesn't exist");
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

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const { title, author, tags, paragraphs } = req.body;
        try {
            const newPost = await new Post({ title, author, tags, paragraphs }).save();
            res.json(newPost);
        } catch (e) {
            next(e);
        }
    },
];