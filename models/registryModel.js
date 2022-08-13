const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const registrySchema = new Schema({

    registryName: {
        type: String,
    },
    userID: {
        type: String,
    },
    eventID: {
        type: String,
    },
    link: {
        type: String,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    private: {
        type: Boolean,
    }
},
 {
    timestamps: true
}

);

const Registry = mongoose.model('Registry', registrySchema);
module.exports = Registry;