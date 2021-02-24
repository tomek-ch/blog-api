const { Schema, model } = require('mongoose');

const User = new Schema({
    firstName: { type: String, required: true },
    lastName: String,
    description: String,
    password: { type: String, required: true},
    username: { type: String, required: true},
});

module.exports = model('User', User);