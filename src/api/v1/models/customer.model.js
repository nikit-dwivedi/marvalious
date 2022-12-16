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
    city: {
        type: String
    },
    occupation: {
        type: String
    },
    profileImage: {
        type: String,
        default:'https://res.cloudinary.com/djkxsdqmh/image/upload/v1671174943/kyc/avatar_vczkxl.svg'
    },
    isVerified: {
        type: String,
        default: false
    }
}, { timestamps: true })
const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;