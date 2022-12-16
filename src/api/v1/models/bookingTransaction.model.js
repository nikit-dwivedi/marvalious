const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingTransactionSchema = new Schema({

    customId: {
        type: String,
        required: true
    },
    rigId: {
        type: String,
        required: true
    }, 
    bookingAmount: {
        type: String,
        required:true
    },
    isPurchased: {
        type: Boolean ,
         default : false
    }, 
    slot: {
        type: Number,
        required: true
    }, 
    remainingAmount: {
        type: Number,
        required : true
    }, 
    totalAmount: {
        type: Number
    }
}, { timestamps: true })

const bookingTransactionModel = mongoose.model('bookingTransaction', bookingTransactionSchema)
module.exports = bookingTransactionModel