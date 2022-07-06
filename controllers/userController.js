const nodemailer = require("nodemailer");
const pbkdf2 = require('pbkdf2');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Registry = require('../models/registryModel');

// USER SIGNUP
exports.Signup = async (req,res,next) => {
    try{
        const query = User.create({
            name: req.body.registration.name,
            emailAddress: req.body.registration.emailAddress,
            password: pbkdf2.pbkdf2Sync(req.body.registration.password, 'life-secret', 1, 32, 'sha512'),
            image: req.body.registration.image,
            eventID: req.body.registration.eventID,
            feeling: req.body.registration.feeling,
            promotionalOffersAndUpdates: req.body.registration.promotionalOffersAndUpdates
        });

        const Signup = await query;

        const userID = Signup._id;
        const eventID = req.body.registration.eventID;

        const secondQuery = Registry.create({
            registryName: req.body.registration.registryName,
            userID: userID,
            link: 'none',
            eventID: eventID,
            private: true //by default private hoga at signup
        })
        const CreateRegistry = await secondQuery;
        const registryID = CreateRegistry._id;

        const newLink = 'http://localhost:7000/registry/private/view/' + registryID;
        const filter = {_id: registryID};
        const update = {link: newLink};

        const thirdQuery = Registry.updateMany(filter, update, {new: true, runValidators: true});
        const updateLink = await thirdQuery;



        next();
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}


// EMAIL VERIFY AT USER SIGNUP
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
            html: `<p>Click the following link for successful sign-up</p> <button><a href="https://famous-dieffenbachia-243151.netlify.app/profile">Click Here</a></button>`
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

        //   const token = jwt.sign({id: data._id}, 'project-life');

          res.status(201).json({status: '201', message: 'success'})
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'})
    }
}



// USER LOGIN
exports.Login = async (req,res) => {
    try{

        if(!req.body.emailAddress || !req.body.password){
            throw new Error ('Please enter an email or password');
        }
        
        // console.log('This is email', req.body.emailAddress, 'and this is password', pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512'));

        const query = User.findOne({jsAddress: req.body.emailAddress, password: pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512')});
        const FindUser = await query;

        if (!FindUser){
            throw new Error('Email or Password is incorrect');
        }
        const token = jwt.sign({id: FindUser._id}, 'life-secret');

        res.status(200).json({status: 'success', token: token, message: FindUser});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: 'fail', message: err.message})
    }
}

// USER CAN CHANGE PROFILE IMAGE
exports.ChangeProfileImage = async (req,res) => {
    try{
        const update = {image: req.body.image};
        const filter = {_id: req.body.userID};

        const query = User.updateMany(filter, update, {new: true, runValidators: true});
        const changeImage = await query;
        res.status(200).json({status: '200', message: 'success', data: changeImage});

    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}


// REGISTRIES (related to the user)

// User can view one particular registry
// In future probably, the response will also contain the services present in the registry.
exports.SpecificRegistry = async (req,res) => {
    try{
        const registryID = req.body.registryID;
        const query = Registry.findById(registryID);
        const findRegistry = await query;

        res.status(200).json({status: '200', message: 'success', data: findRegistry});
    }
    catch(err){
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}

// User can view their all registries
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

// User will add a registry
exports.AddRegistry = async (req,res) => {
    try{

        const query = Registry.create({
            registryName: req.body.registryName,
            userID:req.body.userID,
            eventID: req.body.eventID,
            link: 'none',
            private: true
        });

        const addRegistry = await query;
        const registryID = addRegistry._id
        const filter = {_id: registryID};
        const newLink = 'http://localhost:7000/registry/private/view/' + registryID;
        const update = {link: newLink};

        const secondQuery = Registry.updateOne(filter, update, {new: true, runValidators: true});
        const updateRegistry = await secondQuery;


        res.status(201).json({status: '201', message: 'success', data: updateRegistry});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});

    }
}

// User will delete a registry
exports.DeleteRegistry = async(req,res) => {
    try{
        const query = Registry.findByIdAndDelete(req.body.registryID);
        const deleteRegistry = await query;

        res.status(200).json({status: '200', message: 'success'});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'});
    }
}

// User will edit privacy status of the registry
exports.ChangePrivacy = async (req,res) => {
    try{
        const filter = {_id: req.body.registryID};
        const update = {private: req.body.private};

        const query = Registry.updateMany(filter, update, {new: true, runValidators: true});
        const changePrivacy = await query;
        res.status(200).json({status: '200', message: 'success', data: changePrivacy});

    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}

// User can generate a link of a Private Registry

exports.GenerateLink = async (req,res) => {
    try {
        // .select('-_id link')
        const query = Registry.findById(req.body.registryID);
        const registryLink = await query;

        if (registryLink.private == false){
            throw new Error('The Registry should be private to generate a link');
        }

        res.status(200).json({status: '200', message: 'success', data: {link: registryLink.link}});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}
