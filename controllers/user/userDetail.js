const User = require('../../models/User');
const { param, validationResult } = require('express-validator');

module.exports = [

    param('id', 'Invalid user id')
        .isMongoId(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json([errors[0].msg]);

        const user = await User.findById(req.params.id).catch(next);
        if (!user) res.status(404);
        res.json(user);
    },
];