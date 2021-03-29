const { Schema, model } = require('mongoose');

const Reply = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true},
    timestamp: { type: Number, required: true},
});

module.exports = model('Reply', Reply);