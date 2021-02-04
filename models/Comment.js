const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

function formatTime() {
    return DateTime.fromMillis(this.timestamp).toLocaleString(DateTime.DATE_MED);
}

const Response = new Schema({
    text: { type: String, required: true},
    timestamp: { type: Number, required: true},
});

Response.virtual('time').get(formatTime);


const Comment = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    name: { type: String, required: true },
    timestamp: { type: Number, required: true },
    responses: [Response],
    text: { type: String, required: true },
});

Comment.virtual('time').get(formatTime);


module.exports = model('Comment', Comment);