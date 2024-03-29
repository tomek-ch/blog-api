const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

function formatTime() {
    return DateTime.fromMillis(this.timestamp).toLocaleString(DateTime.DATE_MED);
}

const Comment = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: function () {
            return !this.comment;
        },
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: function () {
            return !this.post;
        },
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Number, required: true },
    text: { type: String, required: true },
    replyCount: { type: Number, default: 0 },
});

Comment.virtual('time').get(formatTime);
Comment.set('toJSON', { virtuals: true });
module.exports = model('Comment', Comment);