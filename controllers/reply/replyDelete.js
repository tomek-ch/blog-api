const Reply = require('../../models/Reply');
const { param, validationResult } = require('express-validator');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    param('id', 'Invalid reply id')
        .isMongoId(),

    async (req, res, next) => {
        
        try {
            const reply = await Reply.findById(req.params.id);
            if (req.user._id.toString() !== reply.author.toString())
                return res.sendStatus(403);
    
            const errors = validationResult(req).array();
            if (errors.length)
                return res
                    .status(400)
                    .json([errors[0].msg]);
    
            res.json(await Reply.findByIdAndDelete(req.params.id));
        } catch (e) {
            next(e);
        }
    },
];