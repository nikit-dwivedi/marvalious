const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nomineeSchema = new Schema({
    customerId: {
        type: String
    },
    nomineeName: {
        type: String
    },
    nomineeRelation: {
        type: String
    },
    nomineeAadhaarNo: {
        type: String
    }
})

exports.nomineeModel = mongoose.model('nominee', nomineeSchema);
