const Author = require('../../models/Author');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
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
            

        const authorsPosts = (await Post.find({ author: req.params.id })).map(post => post._id);
        const [deletedAuthor] = await Promise.all([
            Author.findByIdAndDelete(req.params.id),
            Post.deleteMany({ author: req.params.id }),
            ...authorsPosts.map(post => Comment.deleteMany({ post })),
        ]).catch(next);

        res.json(deletedAuthor);
    },
];