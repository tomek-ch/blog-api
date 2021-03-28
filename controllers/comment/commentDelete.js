const Comment = require('../../models/Comment');
const { param, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Invalid comment id')
        .isMongoId(),

    async (req, res, next) => {
        
        try {
            const comment = await Comment.findById(req.params.id);
            if (req.user._id.toString() !== comment.author.toString())
                return res.sendStatus(403);
    
            const errors = validationResult(req).array();
            if (errors.length)
                return res
                    .status(400)
                    .json([errors[0].msg]);
    
            res.json(await Comment.findByIdAndDelete(req.params.id));
        } catch (e) {
            next(e);
        }
    },
];