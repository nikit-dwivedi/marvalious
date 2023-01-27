const mongoose = require('mongoose');
const Schema = mongoose.Schema

const balanceSchema = new Schema({

    customId: {
        type: String,
    },
    investAmount: {
        type: Number,
        default: 0,
        required: true
    },
    profit: {
        type: Number,
        default: 0
    }, 
}, { timestamps: true })

const balanceModel = mongoose.model('balance', balanceSchema)
module.exports = balanceModel