const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    customId: {
        type: String,
        required: true
    },
    bankId: {
        type: String,
        unique: true
    },
    bankName: {
        type: String,
        required:true
    },
    accountNumber: {
        type: String,
        required: true
    },
    ifsc: {
        type: String,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    upiId: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const bankModel = mongoose.model('bank', bankSchema);
module.exports = bankModel