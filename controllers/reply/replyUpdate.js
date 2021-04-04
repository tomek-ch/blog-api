const Reply = require('../../models/Reply');
const { body, param, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Please provide a valid reply id')
        .isMongoId().bail()
        .custom(async (id, { req }) => {
            try {
                const reply = await Reply.findById(id);
                if (!reply)
                    return Promise.reject("Reply doesn't exist");
                if (reply.author.toString() !== req.user._id.toString())
                    return Promise.reject('Unauthorized');
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('text', 'Please enter a reply')
        .trim()
        .isLength({ min: 1 }),

    async (req, res, next) => {

        const errors = validationResult(req).array().map(err => err.msg);        
        if (errors.includes('Unauthorized'))
            return res.sendStatus(403);

        if (errors.length)
            return res
                .status(400)
                .json(errors);

        const { text } = req.body;
        const newData = {
            text,
            timestamp: Date.now(),
        };

        const reply = await Reply.findByIdAndUpdate(req.params.id, newData, { new: true }).catch(next);
        res.json(reply);
    },
];