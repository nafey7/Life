const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const eventSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name of Event is required'],
        validate: [validator.isAlpha, 'Name must contain only letters']

    },
    type: {
        type: String,
        required: [true, 'Type of Event is required'],
        validate: [validator.isAlpha, 'Name must contain only letters']

    },
    status: {
        type: String,
        required: [true, 'Status of Event is required']
    },
    userID: {
        type: String,
        required: [true, 'User ID as Foreign key is required'],
    }
},
 {
    timestamps: true
}

);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;