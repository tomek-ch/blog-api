const User = require('../../models/User');
const Post = require('../../models/Post');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username.toString() });
        if (!user)
            return res.sendStatus(404);

        const posts = await Post
            .find({ author: user._id, isPublished: true })
            .sort({ 'timestamp': 'desc' });
            
        return res.json({ user, posts });

    } catch (e) {
        next(e);
    }
};