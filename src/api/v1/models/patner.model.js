const mongoose = require('mongoose');
const Schema = mongoose.Schema

const patnerSchema = new Schema({
    patnerId: {
        type: String,
        unique: true,
        required: true
    },
    customId: {
        type: String,
        required: true
    },
    slabSettingId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false
    }
})

const patnerModel = mongoose.model('patner', patnerSchema);
module.exports = patnerModel