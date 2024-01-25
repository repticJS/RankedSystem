const mongoose = require('mongoose');

const Schema = new mongoose.Schema({

    ID: {
        type: String
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
    Config: {
        type: Object
    },
    Staff: {
        type: Object
    }

})

const model = new mongoose.model('RankedSystem_Guild', Schema);

module.exports = model;