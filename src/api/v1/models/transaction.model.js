const mongoose = require('mongoose');
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    // transactionId: {
    //     type: String
    // },
    customId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Credited', 'Invested' , 'Booking Settled']
    },
    amount: {
        type: Number
    }
}, { timestamps: true })

const transactionModel = mongoose.model('transaction', transactionSchema)
module.exports = transactionModel