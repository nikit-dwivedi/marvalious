const mongoose = require('mongoose');
const Schema = mongoose.Schema

const partnerSchema = new Schema({
    partnerId: {
        type: String,
        unique: true,
        required: true
    },
    customId: { 
        type: String,
        required: true
    },
    slabInfo: {
        slabSettingId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        percent: {
            type: Number,
            required: true
        },
        interest: {
            type: Number,
            required: true,
        },
        locking: {
            type: Number,
            required: true
        },
    },
    date: {
        type: String,
        required: true,
    },
    expireDate: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profit: {
        type: Number,
        default: 0
    }, 
 
}, { timestamps: true })

const partnerModel = mongoose.model('partner', partnerSchema);
module.exports = partnerModel