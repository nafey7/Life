const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const registrySchema = new Schema({

    registryName: {
        type: String,
        required: [true, 'Registry Name is required']
    },
    userID: {
        type: String,
        required: [true, 'User ID is required']
    },
    eventID: {
        type: String,
        required: [true, 'Event ID is required']
    },
    link: {
        type: String,
        required: [true, 'Link of the registry is required']
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: [true, 'Status of Event is required']
    },
    private: {
        type: Boolean,
        required: [true, 'Privacy Status is required']
    }
},
 {
    timestamps: true
}

);

const Registry = mongoose.model('Registry', registrySchema);
module.exports = Registry;