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
        default: 'https://res.cloudinary.com/fablo/image/upload/v1673077347/Marvellous_Kyc/male-placeholder-image-removebg-preview-removebg-preview_dab09r.png'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;