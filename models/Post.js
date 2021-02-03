const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

const Paragraph = new Schema({
    heading: String,
    body: String,
});

const Post = new Schema({
    title: String,
    timestamp: Number,
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    tags: [String],
    paragraphs: [Paragraph],
    isPublished: Boolean,
});

Message
    .virtual('time')
    .get(function () {
        return DateTime.fromMillis(this.timestamp).toLocaleString(DateTime.DATE_MED);
    });

module.exports = model('Post', Post);