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
        required: true
    },
    persent: {
        type: Number,
        required: true
    },
    intrest: {
        type: Number,
        required: true,
    },
    locking: {
        type: Number,
        required: true
    },
    slot: {
        type: Number,
        required: true
    }
})

const slabSettingModel = mongoose.model('slabSetting', slabSettingSchema);
module.exports = slabSettingModel