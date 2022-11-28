const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nomineeSchema = new Schema({
    customerId: {
        type: String
    },
    name: {
        type: String
    },
    relation: {
        type: String
    },
    aadhaarNo: {
        type: String
    }
})

exports.nomineeModel = mongoose.model('nominee', nomineeSchema);
