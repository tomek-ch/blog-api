const User = require('../../models/User');

module.exports = async (req, res, next) => {
    res.json(await User.find().catch(next));
};