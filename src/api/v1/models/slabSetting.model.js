const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slabSettingSchema = new Schema({
    slabSettingId: {
        type: String,
        unique: true,
        required: true
    },
    amount: {
        type: Number,
        required: [true, "please provide amount"]
    },
    percent: {
        type: Number,
        required: [true, "please provide percent"]
    },
    interest: {
        type: Number,
        required: [true, "please provide interest"],
    },
    income: {
        type: Number,
        required: true
    },
    locking: {
        type: Number,
        required: [true, "please provide locking"]
    },
    slotBookingCharge: {
        type: Number,
        required: [true, "please provide booking charge"]
    }
})

const slabSettingModel = mongoose.model('slabSetting', slabSettingSchema);
module.exports = slabSettingModel