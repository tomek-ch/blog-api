const auth = require('../../middleware/authenticate');

module.exports = [
    auth,
    (req, res) => res.json(req.user),
];