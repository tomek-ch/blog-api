const User = require('../../models/User');
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Invalid id')
        .isMongoId().bail()
        .custom(async (id, { req }) => {
            try {
                const user = await User.findById(id);

                if (!user)
                    return Promise.reject("User doesn't exist");

                if (req.body.newPassword) {
                    const { oldPassword } = req.body;

                    if (!oldPassword)
                        return Promise.reject('To set a new password provide the old one as well');
                    if (!await bcrypt.compare(oldPassword, user.password))
                        return Promise.reject('Old password is incorrect');
                }
            } catch (e) {
                return Promise.reject('There was a network error');
            }
        }),

    body('fistName', 'Max length for first name is 20 characters')
        .optional()
        .trim()
        .isLength({ min: 1, max: 20 }),

    body('lastName', 'Max length for last name is 20 characters')
        .optional()
        .trim()
        .isLength({ min: 1, max: 20 }),

    body('description', 'Max length for profile description is 100 characters')
        .trim()
        .isLength({ min: 1, max: 100 })
        .optional(),

    body('newPassword')
        .isLength({ min: 1 })
        .optional(),

    body('username', 'Max length for username is 20 characters')
        .trim()
        .isLength({ min: 1, max: 20 })
        .optional()
        .custom(async username => {
            try {
                if (username && await User.findOne({ username }))
                    return Promise.reject('Username taken');
            } catch {
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

        const newData = ['firstName', 'lastName', 'description', 'username'].reduce((data, field) => {
            const value = req.body[field];
            if (value !== undefined)
                return { ...data, [field]: value };
            return data;
        }, {});

        const { newPassword } = req.body;
        try {
            if (newPassword)
                newData.password = await bcrypt.hash(req.body.newPassword, 10);

            const user = await User.findByIdAndUpdate(req.params.id, newData, { new: true });
            res.json(user);
        } catch (e) {
            next(e);
        }
    },
];