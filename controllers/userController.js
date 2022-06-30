const nodemailer = require("nodemailer");
const pbkdf2 = require('pbkdf2');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Registry = require('../models/registryModel');

// Signup
exports.Signup = async (req,res,next) => {
    try{
        const query = User.create({
            firstAndLastName: req.body.registration.firstAndLastName,
            emailAddress: req.body.registration.emailAddress,
            password: pbkdf2.pbkdf2Sync(req.body.registration.password, 'life-secret', 1, 32, 'sha512'),
            userType: req.body.registration.userType,
            eventID: req.body.registration.eventID,
            feeling: req.body.registration.feeling,
            promotionalOffersAndUpdates: req.body.registration.promotionalOffersAndUpdates
        });

        const Signup = await query;
        console.log('This is the ID of the User',Signup._id.toString());

        const userID = Signup._id.toString();
        const eventID = req.body.registration.eventID.toString();

        const secondQuery = Registry.create({
            userID: userID,
            eventID: eventID,
            publicAndPrivacyInd: 'private' //by default private hoga at signup
        })
        const CreateRegistry = await secondQuery;

        next();
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'});
    }
}


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
            to: req.body.registration.emailAddress,
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

          const query = User.findOne({emailAddress: req.body.registration.emailAddress});
          const data = await query;

          res.status(201).json({status: '201', message: 'success'})
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'})
    }
}



// Login
exports.Login = async (req,res) => {
    try{

        if(!req.body.emailAddress || !req.body.password){
            throw new Error ('Please enter an email or password');
        }

        const query = User.findOne({jsAddress: req.body.emailAddress, password: pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512')});
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


// REGISTRIES

// View All Registries for a user
exports.ViewRegistries = async (req,res) => {
    try{
        // later get user ID through verifying from the token
        const filter = {userID: req.body.userID};
        const query = Registry.find(filter);
        const viewRegistries = await query;
        res.status(200).json({status:'200', message: 'success', data: viewRegistries});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}

// Add a Registry
exports.AddRegistry = async (req,res) => {
    try{

        const query = Registry.create({
            userID:req.body.userID,
            eventID: req.body.eventID,
            publicAndPrivacyInd: 'private'
        });

        const addRegistry = await query;

        res.status(201).json({status: '201', message: 'success', data: addRegistry});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});

    }
}

// Delete Registry
exports.DeleteRegistry = async(req,res) => {
    try{
        const query = Registry.findByIdAndDelete(req.body.id);
        const deleteRegistry = await query;

        res.status(200).json({status: '200', message: 'success'});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'});
    }
}

