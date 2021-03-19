const User = require('../../models/User');
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

module.exports = [

    param('id', 'Invalid id')
        .isMongoId().bail()
        .custom(async id => {
            try {
                if (!await User.findById(id))
                    return Promise.reject("User doesn't exist");
            } catch (e ){
                return Promise.reject('There was a network error');
            }
        }),

    body('fistName')
        .trim()
        .isLength({ min: 1 })
        .optional(),

    body('lastName')
        .trim()
        .isLength({ min: 1 })
        .optional(),

    body('description')
        .trim()
        .isLength({ min: 1 })
        .optional(),

    body('password')
        .trim()
        .isLength({ min: 1 })
        .optional(),

    body('username')
        .trim()
        .isLength({ min: 1 })
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

        try {
            if (req.body.password)
                newData.password = await bcrypt.hash(req.body.password, 10);

            const user = await User.findByIdAndUpdate(req.params.id, newData, { new: true });
            res.json(user);
        } catch (e) {
            next(e);
        }
    },
];