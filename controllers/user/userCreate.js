const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

module.exports = [

    body('firstName', 'Please enter your first name')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('lastName')
        .trim()
        .escape(),

    body('description')
        .trim()
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
                if (username && await User.findOne({ username }))
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


        const { firstName, lastName, description, username } = req.body;
        try {
            const password = await bcrypt.hash(req.body.password, 10);
            const newUser = await new User({
                firstName, lastName, description, password, username
            }).save();
            res.json(newUser);
        } catch (e) {
            next(e);
        }
    },
];