const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    userId: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
    },
    otp: {
        type: String
    },
    reqId: {
        type: String,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    noOfOtp: {
        type: Number,
        default: 1
    },
    date: {
        type: Number,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
})
const authModel = mongoose.model('auth', authSchema);
module.exports = authModel;