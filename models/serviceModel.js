const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({

    name: {
        type: String
    },
    rating: {
        type: Number
    },
    numberOfRatings: {
        type: Number
    },
    remoteServices: {
        type: Boolean
    },
    onlineStatus: {
        type: Boolean
    },
    responseTime: {
        type: String
    },
    location: {
        type: String
    },
    cost: {
        type: String
    },
    image: {
        type: String
    },
    comment: {
        type: String
    }
},
 {
    timestamps: true
}

);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;