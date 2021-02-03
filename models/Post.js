const { Schema, model } = require('mongoose');

const Paragraph = new Schema({
    heading: String,
    body: String,
});

const Post = new Schema({
    title: String,
    timestamp: Number,
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    tags: [String],
    comments: { type: Schema.Types.ObjectId, ref: 'Comment' },
    paragraphs: [Paragraph],
    isPublished: Boolean,
});

module.exports = model('Post', Post);