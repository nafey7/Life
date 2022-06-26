const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
// const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        validate: [validator.isAlpha, 'Name must contain only letters']

    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required'],
        validate: [validator.isAlpha, 'Name must contain only letters']

    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Minimum password length is 8']
    },
    event: {
        type: String,
        required: [true, 'Event is required']
    },
    feeling: {
        type: String,
        required: [true, 'Feeling is required']
    }
},
 {
    timestamps: true
}

);

// userSchema.pre('save', async function(next){
//     if (this.isModified('password')){
//         this.password = await bcrypt.hash(this.password, 12);
//         this.passwordConfirm = undefined;
//         next();
//     }
// })

const User = mongoose.model('User', userSchema);
module.exports = User;