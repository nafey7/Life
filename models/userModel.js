const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
// const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    firstandLastName: {
        type: String
    },
    emailAddress: {
        type: String,
        unique: [true, 'Account with this email already exists'],
        sparse: true,
        autoIndexId: false,
        validate: [validator.isEmail, 'Enter a valid email']
    },
    password: {
        type: String,
        minlength: [8, 'Minimum password length is 8']
    },
    image: {
        type: String,
        default: 'img.png'
    },
    eventName: {
        type: String,
    },
    feeling: {
        type: String,
    },
    promotionalOffersAndUpdates: {
        type: Boolean
    }
},
 {
    timestamps: true
}

);

const User = mongoose.model('User', userSchema);
module.exports = User;