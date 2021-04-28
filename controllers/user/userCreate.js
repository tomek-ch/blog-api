const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = [

    body('firstName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Please enter your first name')
        .isLength({ max: 20 })
        .withMessage('Max length for last name is 20 characters'),

    body('lastName', 'Max length for last name is 20 characters')
        .optional()
        .isLength({ min: 1, max: 20 })
        .trim(),

    body('description', 'Max length for profile description is 100 characters')
        .optional()
        .isLength({ min: 1, max: 100 })
        .trim(),

    body('password', 'Please enter a password')
        .isString()
        .isLength({ min: 1 }),

    body('username', 'Please enter a username')
        .trim()
        .isLength({ min: 1 })
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
            const user = await new User({
                firstName, lastName, description, password, username
            }).save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.json({ user, token });

        } catch (e) {
            return next(e);
        }
    },
];