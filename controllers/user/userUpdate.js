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
                const user = await User.findById(id)
                if (!user)
                    return Promise.reject("User doesn't exist");
                if (req.user._id.toString() !== user._id.toString())
                    return Promise.reject('Unauthorized');
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

        if (errors.includes('Unauthorized'))
            return res.sendStatus(403);

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