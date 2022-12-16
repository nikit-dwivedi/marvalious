const mongoose = require('mongoose');
const Schema = mongoose.Schema

const balanceSchema = new mongoose.Schema({


    customId: {
        type: String
    },
    investAmount: {
        type: String
    },
    profit: {
        type: String
    }
})