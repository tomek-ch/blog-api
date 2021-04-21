const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const auth = require('../../middleware/authenticate');

module.exports = [

    auth,

    async (req, res, next) => {
        try {

            const [posts, comments] = await Promise.all([
                Post.find({ author: req.user._id }),
                Comment.find({ author: req.user._id })
                    .populate('comment'),
            ]);

            return res.json({
                published: posts.filter(post => post.isPublished),
                unpublished: posts.filter(post => !post.isPublished),
                comments,
            });
        } catch (e) {
            return next(e);
        }
    },
];