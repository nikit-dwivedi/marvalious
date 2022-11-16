const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminId: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        unique: true
    },
    otp: {
        type: String
    },
    reqId: {
        type: String,
        unique: true
    },
    noOfOtp: {
        type: Number,
        default: 1
    },
    date: {
        type: Number,
    }
})

const adminModel = mongoose.model('admin', adminSchema);
module.exports = adminModel