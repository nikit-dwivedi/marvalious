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
        type: String
    },
    accountNumber: {
        type: String
    },
    ifsc: {
        type: String
    },
    accountHolderName: {
        type: String
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