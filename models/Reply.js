const { Schema, model } = require('mongoose');
const { DateTime } = require('luxon');

function formatTime() {
    return DateTime.fromMillis(this.timestamp).toLocaleString(DateTime.DATE_MED);
}

const Reply = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true},
    timestamp: { type: Number, required: true},
});

Reply.virtual('time').get(formatTime);
Reply.set('toJSON', { virtuals: true });
module.exports = model('Reply', Reply);