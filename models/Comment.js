const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

function formatTime() {
    return DateTime.fromMillis(this.timestamp).toLocaleString(DateTime.DATE_MED);
}

const Response = new Schema({
    heading: String,
    body: String,
    timestamp: Number,
});

Response.virtual('time').get(formatTime);


const Comment = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    name: String,
    timestamp: Number,
    responses: [Response],
    text: String,
});

Comment.virtual('time').get(formatTime);


module.exports = model('Comment', Comment);