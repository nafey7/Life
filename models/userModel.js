const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
// const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']

    },
    emailAddress: {
        type: String,
        unique: [true, 'Account with this email already exists'],
        sparse: true,
        autoIndexId: false,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Minimum password length is 8']
    },
    image: {
        type: String,
        required: [true, 'Role of the user is required']
    },
    eventID: {
        type: String,
        required: [true, 'Event is required']
    },
    feeling: {
        type: String,
        required: [true, 'Feeling is required']
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