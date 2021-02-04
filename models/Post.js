const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

const Paragraph = new Schema({
    heading: String,
    body: { type: String, required: true },
});

const Post = new Schema({
    title: { type: String, required: true},
    timestamp: { type: Number, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    tags: [String],
    paragraphs: { type: [Paragraph], required: true },
    isPublished: { type: Boolean, required: true},
});

Post
    .virtual('time')
    .get(function () {
        return DateTime.fromMillis(this.timestamp).toLocaleString(DateTime.DATE_MED);
    });

module.exports = model('Post', Post);