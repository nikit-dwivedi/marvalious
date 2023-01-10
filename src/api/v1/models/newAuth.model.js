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
    date: {
        type: Number,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
})
const newAuthModel = mongoose.model('newauth', authSchema);
module.exports = newAuthModel;