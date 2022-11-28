const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slabSchema = new Schema({
    totalSlab: {
        type: Number,
        default: 0
    },
    freeSlab: {
        type: Number,
        default: 0
    },
    bookedSlab: {
        type: Number,
        default: 0
    }
})

const slabModel = mongoose.model('slab', slabSchema);
module.exports = slabModel