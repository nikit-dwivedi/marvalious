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
        enum: ['Credited', 'Invested']
    },
    amount: {
        type: String
    },
    Date: {
        type: String,
    }, 
}, { timestamps: true })

const transactionModel = mongoose.model('transaction', transactionSchema)
module.exports = transactionModel