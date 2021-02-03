const { Schema, model } = require('mongoose');

const Author = new Schema({
    name: String,
    description: String,
    password: String,
    username: String,
});

module.exports = model('Author', Author);