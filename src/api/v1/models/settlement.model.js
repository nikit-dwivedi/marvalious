const mongoose = require('mongoose');
const Schema = mongoose.Schema


const settlementSchema = new Schema({

    customId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "settlement"
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Processing','Settled'],
        default:'Processing'
    },

}, { timestamps: true })

const settlementModel = mongoose.model('settlement', settlementSchema)
module.exports = settlementModel