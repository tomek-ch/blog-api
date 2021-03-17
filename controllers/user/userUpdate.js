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

    body('name')
        .trim(),

    body('description')
        .trim(),

    body('password')
        .trim(),

    body('username')
        .trim()
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

        const { name, description, username } = req.body;
        const newData = { name, description, username };

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