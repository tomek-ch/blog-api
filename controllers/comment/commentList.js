const Comment = require('../../models/Comment');

module.exports = async (req, res, next) => {
    const { post } = req.query;
    res.json(await Comment.find({ post }).populate('author').populate('replies').catch(next));
};