const mongoose = require('mongoose');

const comments = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    isReply: {
        type: Boolean,
        default: false
    },
    replyCount: {
        type: Number,
        default: 0
    },
    Replies: [this],
    timestamp: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Comment', comments);