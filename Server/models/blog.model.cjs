const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    views: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    viewsCount: {
        type: Number,
        default: 0,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Blog', BlogSchema);
