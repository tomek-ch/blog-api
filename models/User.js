const { Schema, model } = require('mongoose');

const User = new Schema({
    firstName: { type: String, required: true, maxLength: 15 },
    lastName: { type: String, maxLength: 15 },
    description: { type: String, maxLength: 100 },
    password: { type: String, required: true },
    username: { type: String, required: true, maxLength: 15 },
});

module.exports = model('User', User);