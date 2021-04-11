const User = require('../../models/User');
const Post = require('../../models/Post');
const { ObjectId } = require('mongoose').Types;

module.exports = async (req, res, next) => {

    if (!ObjectId.isValid(req.params.id))
        return res.sendStatus(404);

    const [user, posts] = await Promise.all([
        User.findById(req.params.id),
        Post.find({ author: req.params.id, isPublished: true }),
    ]).catch(next);

    if (!user)
        return res.sendStatus(404);
    return res.json({ user, posts });
};