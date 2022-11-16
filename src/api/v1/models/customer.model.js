const mongoose = require('mongoose');
const Schema = mongoose.Schema



const customerSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    profileImage: {
        type: String
    },
    isVerified: {
        type: String
    }
}, { timestamps: true })
const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;