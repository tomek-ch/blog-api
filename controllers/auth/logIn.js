const Author = require('../../models/Author');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

module.exports = [

    body('username', 'Please enter your username')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body('password', 'Please enter your password')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        try {

            const user = await Author.findOne({ username: req.body.username });
            if (!user)
                return res.status(400).json(["Username doesn't match any account"]);
            
            const passwordMatches = await bcrypt.compare(req.body.password, user.password);
            if (!passwordMatches)
                return res.status(400).json(['Incorrect password']);
            
            res.send(user);

        } catch (e) {
            next(e);
        }
    },
];