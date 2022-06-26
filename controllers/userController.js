const nodemailer = require("nodemailer");
const pbkdf2 = require('pbkdf2');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Event = require('../models/eventModel');

// Signup
exports.CreateRegistry = async (req,res,next) => {
    try{
        const query = User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512'),
            role: req.body.role,
            event: req.body.event,
            feeling: req.body.feeling
        });

        const CreateRegistry = await query;
        next();
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 'fail', message: err.message});
    }
}

// exports.EventatSignup = async (req,res,next) => {
//     try{
//         const query = User.findOne({email: req.body.email});
//         const FindUser = await query;

//         const userID = FindUser._id.toString()

//         const queryTwo = Event.create({
//             name: req.body
//         })

//         // console.log("This is the result:",userID);
//         res.send('success');
//     }
//     catch(err){
//         console.log(err);
//         res.send('error');
//     }
// }

// Email Verification at Signup
exports.VerifyEmail = async (req,res,next) => {
    try{
        
        let transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          });
          
          let mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Welcome to Life',
            html: `<p>Enter the following pin for successful sign-up</p> <button><a href="https://famous-dieffenbachia-243151.netlify.app/">Click Here</a></button>`
          };
          
          await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                throw new Error ('Unexpected Error while sending Email')
            } else {
                console.log('Email sent: ' + info.response);
                
            }
          });

          const query = User.findOne({email: req.body.email});
          const data = await query;

          res.status(200).json({status: 'success', message: data})
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 'fail', message: err.message})
    }
}

exports.Login = async (req,res) => {
    try{

        if(!req.body.email || !req.body.password){
            throw new Error ('Please enter an email or password');
        }

        const query = User.findOne({email: req.body.email, password: pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512')});
        const FindUser = await query;

        if (!FindUser){
            throw new Error('Email or Password is incorrect');
        }

        res.status(200).json({status: 'success', message: FindUser});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 'fail', message: err.message})
    }
}
