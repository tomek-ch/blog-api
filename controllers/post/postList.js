const Post = require('../../models/Post');
const auth = require('../../middleware/authenticate');

module.exports = [
    async (req, res, next) => {
        try {

            if (req.headers.authorization)
                return next();

            const { author, tags, title } = req.query;

            const options = {
                author,
                tags,
                title: title ? new RegExp(title, 'i') : undefined,
                isPublished: true,
            };

            const posts = await Post
                .find(options)
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