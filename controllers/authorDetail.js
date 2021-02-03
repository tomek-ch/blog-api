const Author = require('../models/Author');

module.exports = async (req, res, next) => {
    res.json(await Author.findById(req.params.id).catch(next));
};