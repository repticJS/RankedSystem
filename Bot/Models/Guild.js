const mongoose = require('mongoose');

const Schema = new mongoose.Schema({

    ID: {
        type: String
    },
    Logs: {
        type: Array
    },
    Admin: {
        type: Object
    },
    TwoMans: {
        type: Object
    },
    FourMans: {
        type: Object
    },
    SixMans: {
        type: Object
    },
    Setup: {
        type: Object
    }

})

const model = new mongoose.model('RankedSystem_Guild', Schema);

module.exports = model;