const Author = require('../../models/Author');

module.exports = async (req, res, next) => {
    res.json(await Author.find().catch(next));
};