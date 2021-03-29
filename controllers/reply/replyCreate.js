const Comment = require('../../models/Comment');
const Reply = require('../../models/Reply');
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    body('comment', 'Please provide a comment')
        .trim()
        .isMongoId().bail()
        .custom(async id => {
            try {
                if (!await Comment.findById(id))
                    return Promise.reject("Comment doesn't exist");
            } catch {
                return Promise.reject('There was a network error');
            }
        }),

    body('text', 'Please enter a reply')
        .trim()
        .isLength({ min: 1 }),

    async (req, res, next) => {

        const errors = validationResult(req).array();
        if (errors.length)
            return res
                .status(400)
                .json(errors.map(err => err.msg));

        const { comment, text } = req.body;

        try {
            const reply = await new Reply({
                text,
                timestamp: Date.now(),
                author: req.user._id,
            }).save();
    
            await Comment
                .findByIdAndUpdate(comment, { $push: { replies: reply } }, { new: true });
    
            return res.json(reply);
        } catch(e) {
            next(e);
        }
    },
];