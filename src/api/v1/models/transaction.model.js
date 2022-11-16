const mongoose = require('mongoose');
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    transactionId: {
        type: String
    },
    customId: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['credit', 'debit']
    },
    amount: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    }
})