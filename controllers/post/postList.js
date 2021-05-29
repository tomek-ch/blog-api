const Post = require('../../models/Post');
const auth = require('../../middleware/authenticate');
const { ObjectId } = require('mongoose').Types;

module.exports = [
    async (req, res, next) => {
        try {

            if (req.headers.authorization)
                return next();

            const { author, tags, title } = req.query;

            if (author && !ObjectId.isValid(author))
                return res
                    .status(400)
                    .json(['Invalid author id']);

            const options = {
                author,
                tags: tags?.toString(),
                title: title ? new RegExp(`^${title?.toString()}`, 'i') : undefined,
                isPublished: true,
            };

            const posts = await Post
                .find(options)
                .sort({ 'timestamp': 'desc' })
                .populate('author');

            return res.json(posts);

        } catch (e) {
            return next(e);
        }
    },

    auth,

    async (req, res, next) => res.json(await Post.find({
        author: req.user._id,
        isPublished: false,
    }).catch(next)),
];