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
    occupation: {
        type: String
    }, 
    selfie: {
        type: String
    },
    aadhaarNumber: {
        type: String,
        unique: true,
        required: true,
    },
    aadhaarFront: {
        type: String,
    },
    aadhaarBack: {
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
        type: Boolean,
        default: false
    }, 
}, { timestamps: true })

const kycModel = mongoose.model('kyc', kycSchema);
module.exports = kycModel;