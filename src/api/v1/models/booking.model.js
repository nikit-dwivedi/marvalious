const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    customId: {
        type: String,
        required: true
    },
    rigId: {
        type: String,
        required: true
    },
    percent: {
        type: Number,
        required: true
    },
    slot: {
        type: Number,
        required : true
    },
    bookingAmount: {
        type: Number,
        required: true
    }, 
    isPurchased: {
        type: Boolean,
        default: false
    },
    remainingAmount: {
        type: Number,
        required: true
    }

    
}, { timestamps: true })

const bookingModel = mongoose.model('booking', bookingSchema)
module.exports = bookingModel
