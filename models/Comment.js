const { Schema, model } = require('mongoose');

const Response = new Schema({
    heading: String,
    body: String,
    timestamp: Number,
});

const Comment = new Schema({
    name: String,
    timestamp: Number,
    responses: [Response],
    text: String,
});

module.exports = model('Comment', Comment);