const mongoose = require('mongoose');
const Schema = mongoose.Schema

const balanceSchema = new Schema({

    customId: {
        type: String,
        required:true
    },
    investAmount: {
        type: String,
        default: 0,
        required: true
    },
    profit: {
        type: String,
        default: 0
    }, 
}, { timestamps: true })

const balanceModel = mongoose.model('balance', balanceSchema)
module.exports = balanceModel