const Author = require('../models/Author');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

module.exports = [

    body('name', 'Please enter a name')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('description', 'Please enter a description')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('password', 'Please enter a password')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('username', 'Please enter a username')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .custom(async username => {
            try {
                if (username && await Author.findOne({ username }))
                    return Promise.reject('Username taken');
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));


        const { name, description, username } = req.body;
        try {
            const password = await bcrypt.hash(req.body.password, 10);
            const newAuthor = await new Author({ name, description, password, username }).save();
            res.json(newAuthor);
        } catch (e) {
            next(e);
        }
    },
];