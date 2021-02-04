const Comment = require('../../models/Comment');

module.exports = async (req, res, next) => {
    res.json(await Comment.find().catch(next));
};