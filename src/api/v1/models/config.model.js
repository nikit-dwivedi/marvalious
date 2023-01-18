const mongoose = require('mongoose');
const Schema = mongoose.Schema


const configSchema = new mongoose.Schema({
    
    version: {
        type: String,
    },
    title: {
        type: String
    },
    message: {
        type: String
    }
}, { timestamps: true })

const configModel = mongoose.model('config', configSchema)
module.exports = configModel