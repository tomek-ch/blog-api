const User = require('../../models/User');

module.exports = async (req, res, next) => {
    const { username } = req.query;

    try {
        if (username) {
            const regex = new RegExp(`^${username}`, 'i');
            return res.json(await User.find({ username: regex }));
        }
        return res.json(await User.find());
        
    } catch (e) {
        return next(e);
    }
};