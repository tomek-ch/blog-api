const Author = require('../../models/Author');
const { param, validationResult } = require('express-validator');

module.exports = [

    param('id', 'Invalid author id')
        .isMongoId(),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json([errors[0].msg]);

        const author = await Author.findById(req.params.id).catch(next);
        if (!author) res.status(404);
        res.json(author);
    },
];