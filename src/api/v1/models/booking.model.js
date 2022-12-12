const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    percentage: {
        type: Number,
        required: true
    },
    slotBookingCharge: {
        type: Number,
        required: true
    }
})

const bookingModel = mongoose.model('booking', bookingSchema)
module.exports = bookingModel
