const mongoose = require('mongoose');
const Schema = mongoose.Schema

const kycSchema = new Schema({
    customId: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    aadharNumber: {
        type: String,
        unique: true,
        required: true,
    },
    aadharFront: {
        type: String,
    },
    aadharBack: {
        type: String,
    },
    panNumber: {
        type: String,
        unique: true,
        required: true
    },
    panFront: {
        type: String
    },
    isVerified: {
        type: String,
        default: false
    }
}, { timestamps: true })

const kycModel = mongoose.model('kyc', kycSchema);
module.exports = kycModel;