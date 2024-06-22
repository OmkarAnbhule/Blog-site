const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    isLoggedin: {
        type: Boolean,
        default: true
    },
    loginTime: {
        type: Date,
    },
    views: {
        type: Number,
        default: 0
    },
    // blog:[{}]
    // review:[{}]
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model('User', UserSchema)