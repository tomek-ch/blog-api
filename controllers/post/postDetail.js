const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { ObjectId } = require('mongoose').Types;

module.exports = async (req, res, next) => {

    if (!ObjectId.isValid(req.params.id))
        return res.sendStatus(404);

    const [post, comments] = await Promise.all([
        Post
            .findById(req.params.id)
            .populate('author'),
        Comment
            .find({ post: req.params.id })
            .populate('author')
            .populate('replies'),
    ]).catch(next);

    if (!post)
        res.sendStatus(404);

    res.json({
        post,
        comments,
    });
};