const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const eventSchema = new Schema({

    eventName: {
        type: String,
        unique: [true, 'Event Names should be unique'],
    },
    eventImage: {
        type: String,
        unique: [true, 'Event Image should be unique'],
    }
},
 {
    timestamps: true
}

);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;