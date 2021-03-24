const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

function formatTime() {
    return DateTime.fromMillis(this.timestamp).toLocaleString(DateTime.DATE_MED);
}

const Comment = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Number, required: true },
    text: { type: String, required: true },
});

Comment.virtual('time').get(formatTime);
module.exports = model('Comment', Comment);