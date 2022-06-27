const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const eventSchema = new Schema({

    eventName: {
        type: String,
        unique: [true, 'Event Names should be unique'],
        required: [true, 'Event Name is required']
    },
    eventImage: {
        type: Buffer,
        required: [true, 'Event Image is required']
    }
},
 {
    timestamps: true
}

);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;