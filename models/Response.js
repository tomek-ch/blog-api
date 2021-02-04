const { Schema, model } = require('mongoose');

const Response = new Schema({
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    text: { type: String, required: true},
    timestamp: { type: Number, required: true},
});

module.exports = model('Response', Response);