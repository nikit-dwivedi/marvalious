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
        required: [true,"please provide amount"]
    },
    percent: {
        type: Number,
        required: [true,"please provide percent"]
    },
    interest: {
        type: Number,
        required: [true,"please provide interest"],
    },
    locking: {
        type: Number,
        required: [true,"please provide locking"]
    },
    slot: {
        type: Number,
        required: [true,"please provide slot"]
    }
})

const slabSettingModel = mongoose.model('slabSetting', slabSettingSchema);
module.exports = slabSettingModel