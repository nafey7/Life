const nodemailer = require("nodemailer");
const pbkdf2 = require('pbkdf2');
const jwt = require('jsonwebtoken');
const xoauth2 = require('xoauth2');
const User = require('../models/userModel');
const Registry = require('../models/registryModel');
const Service = require('../models/serviceModel');


// USER SIGNUP
exports.Signup = async (req,res,next) => {
    try{

        const emailCheckQuery = User.findOne({emailAddress: req.body.emailAddress});
        const emailCheck = await emailCheckQuery;

        if (emailCheck != null){
            throw new Error ('User with this email already exists');
        }

        const query = User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512'),
            eventName: req.body.eventName,
            feeling: req.body.feeling,
            promotionalOffersAndUpdates: req.body.promotionalOffersAndUpdates
        });

        const Signup = await query;

        const userID = Signup._id;
        const eventName = req.body.eventName;

        const secondQuery = Registry.create({
            registryName: 'Registry #1',
            userID: userID,
            link: 'none',
            eventID: eventName,
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
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            },
            tls: {
                ciphers:'SSLv3'
            }
          });
          transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
          });
          let mailOptions = {
            from: process.env.EMAIL,
            to: req.body.emailAddress,
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

          const query = User.findOne({emailAddress: req.body.emailAddress});
          const data = await query;

          const secondQuery = Registry.findOne({userID: data._id}).select('registryName _id eventID private');;
          const secondData = await secondQuery;

          let modifiedData = {
            _id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            password: data.password,
            image: data.image,
            eventName: data.eventName,
            feeling: data.feeling,
            promotionalOffersAndUpdates: data.promotionalOffersAndUpdates,
            userRegistry: secondData
        }

        console.log(modifiedData);
        const finalData = {user: modifiedData, registry: secondData};

          const token = jwt.sign({id: data._id}, 'life-secret');


        //   const token = jwt.sign({id: data._id}, 'project-life');

          res.status(201).json({status: '201', message: 'success', token: token, data: finalData});
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

        const query = User.findOne({emailAddress: req.body.emailAddress, password: pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512')}).select('-createdAt -updatedAt -__v');
        const FindUser = await query;

        if (!FindUser){
            throw new Error('Email or Password is incorrect');
        }
        const token = jwt.sign({id: FindUser._id}, 'life-secret');

        const querySecond = Registry.find({userID: FindUser._id}).select('-createdAt -updatedAt -__v -link -creationDate -userID');
        // this is the array of registries
        const listRegistries = await querySecond;

        let serviceList;
        let queryThird, serviceData;
        let modifiedData = [];
        let obj;
        let serviceArray;

        for (let i=0;i<listRegistries.length;i++){
            obj = {};
            servicesArray = [];
            obj['_id'] = listRegistries[i]._id;
            obj['registryName'] = listRegistries[i].registryName;
            obj['eventID'] = listRegistries[i].eventID;
            obj['private'] = listRegistries[i].private;
            obj['_id'] = listRegistries[i]._id;
            // this is the array of service IDs
            serviceList = listRegistries[i].service;
            // console.log(`This is the list of services for registry number ${i+1}`, serviceList);
            if (serviceList.length > 0){

                for (let j=0;j<serviceList.length;j++){
                    queryThird = Service.findOne({_id: serviceList[j]}).select('-createdAt -updatedAt -__v');
                    serviceData = await queryThird;
                    // console.log(serviceData);
                    // console.log(`For service with id ${serviceList[j]}, this is the data`, serviceData);
                    servicesArray.push(serviceData);
                }
                
            }
            obj['services'] = servicesArray;
            modifiedData.push(obj);
        }

        res.status(200).json({status: '200', message: 'success', token: token, data: {user: FindUser, registries: modifiedData}});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}

// USER CAN CHANGE ACCOUNT SETTINGS
exports.AccountSettings = async (req,res) => {
    try{

        // console.log(checkEmail);
        // throw new Error('wait API check')
        
        let update = {};
        const filter = {_id: req.body.userID};

        if (req.body.emailAddress){
            const checkQuery = User.findOne({emailAddress: req.body.emailAddress});
            const checkEmail = await checkQuery;

            if (checkEmail == null){
                update.emailAddress = req.body.emailAddress;
            }
            else{
                throw new Error ('This email is already in use');
            }
        }
        if (req.body.password){
            if (req.body.password != req.body.reEnterPassword){
                throw new Error("Passwords do not match");
            }
            else{
                update.password = pbkdf2.pbkdf2Sync(req.body.password, 'life-secret', 1, 32, 'sha512');
            }
        }

        if (req.body.firstName){
            update.firstName= req.body.firstName;
        }
        if (req.body.lastName){
            update.lastName = req.body.lastName;
        }
        if (req.body.phoneNumber){
            update.phoneNumber = req.body.phoneNumber;
        }
        if (req.body.address){
            update.address = req.body.address;
        }
        if (req.body.city){
            update.city = req.body.city;
        }
        if (req.body.state){
            update.state = req.body.state;
        }
        if (req.body.zipCode){
            update.zipCode = req.body.zipCode;
        }
        if (req.body.image){
            update.image = req.body.image;
        }

        const query = User.updateOne(filter, update, {new: true, runValidators: true});
        const updateInfo = await query;

        res.status(200).json({status: '200', message: 'success'})
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
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

        if (req.body.serviceID){
            const thirdQuery = Registry.updateOne(filter, {$push: {service: req.body.serviceID}});
            const serviceAdded = await thirdQuery;
        }


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

        const querySecond = Registry.find({userID: req.body.userID}).select('-createdAt -updatedAt -__v -link -creationDate -userID');
        // this is the array of registries
        const listRegistries = await querySecond;

        let serviceList;
        let queryThird, serviceData;
        let modifiedData = [];
        let obj;
        let serviceArray;

        for (let i=0;i<listRegistries.length;i++){
            obj = {};
            servicesArray = [];
            obj['_id'] = listRegistries[i]._id;
            obj['registryName'] = listRegistries[i].registryName;
            obj['eventID'] = listRegistries[i].eventID;
            obj['private'] = listRegistries[i].private;
            obj['_id'] = listRegistries[i]._id;
            // this is the array of service IDs
            serviceList = listRegistries[i].service;
            // console.log(`This is the list of services for registry number ${i+1}`, serviceList);
            if (serviceList.length > 0){

                for (let j=0;j<serviceList.length;j++){
                    queryThird = Service.findOne({_id: serviceList[j]}).select('-createdAt -updatedAt -__v');
                    serviceData = await queryThird;
                    // console.log(`For service with id ${serviceList[j]}, this is the data`, serviceData);
                    servicesArray.push(serviceData);
                }
                
            }
            obj['services'] = servicesArray;
            modifiedData.push(obj);
        }

        res.status(200).json({status: '200', message: 'success', data: modifiedData});
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


// User can add a service to the registry

exports.AddServiceToRegistry = async(req,res) => {
    try{

        const queryCheck = Registry.findOne({_id: req.body.registryID});
        const check = await queryCheck;

        let sudoArr = check.service;

        if (sudoArr.includes(req.body.serviceID) == true){
            throw new Error ("This service already exists in the registry");
        }


        const filter = {_id: req.body.registryID}
        const query = Registry.updateOne(filter, {$push: {service: req.body.serviceID}});
        const updatedData = await query;


        const querySecond = Registry.find({userID: req.body.userID}).select('-createdAt -updatedAt -__v -link -creationDate -userID');
        // this is the array of registries
        const listRegistries = await querySecond;

        let serviceList;
        let queryThird, serviceData;
        let modifiedData = [];
        let obj;
        let serviceArray;

        for (let i=0;i<listRegistries.length;i++){
            obj = {};
            servicesArray = [];
            obj['_id'] = listRegistries[i]._id;
            obj['registryName'] = listRegistries[i].registryName;
            obj['eventID'] = listRegistries[i].eventID;
            obj['private'] = listRegistries[i].private;
            obj['_id'] = listRegistries[i]._id;
            // this is the array of service IDs
            serviceList = listRegistries[i].service;
            // console.log(`This is the list of services for registry number ${i+1}`, serviceList);
            if (serviceList.length > 0){

                for (let j=0;j<serviceList.length;j++){
                    queryThird = Service.findOne({_id: serviceList[j]}).select('-createdAt -updatedAt -__v');
                    serviceData = await queryThird;
                    // console.log(`For service with id ${serviceList[j]}, this is the data`, serviceData);
                    servicesArray.push(serviceData);
                }
                
            }
            obj['services'] = servicesArray;
            modifiedData.push(obj);
        }

        res.status(200).json({status: '200', message: 'success', data: modifiedData});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}

// User can remove a service from the registry

exports.DeleteServiceFromRegistry = async(req,res) => {
    try{
        const filter = {_id: req.body.registryID}
        const query = Registry.updateOne(filter, {$pull: {service: req.body.serviceID}});
        const updatedData = await query;

        const querySecond = Registry.find({userID: req.body.userID}).select('-createdAt -updatedAt -__v -link -creationDate -userID');
        // this is the array of registries
        const listRegistries = await querySecond;

        let serviceList;
        let queryThird, serviceData;
        let modifiedData = [];
        let obj;
        let serviceArray;

        for (let i=0;i<listRegistries.length;i++){
            obj = {};
            servicesArray = [];
            obj['_id'] = listRegistries[i]._id;
            obj['registryName'] = listRegistries[i].registryName;
            obj['eventID'] = listRegistries[i].eventID;
            obj['private'] = listRegistries[i].private;
            obj['_id'] = listRegistries[i]._id;
            // this is the array of service IDs
            serviceList = listRegistries[i].service;
            // console.log(`This is the list of services for registry number ${i+1}`, serviceList);
            if (serviceList.length > 0){

                for (let j=0;j<serviceList.length;j++){
                    queryThird = Service.findOne({_id: serviceList[j]}).select('-createdAt -updatedAt -__v');
                    serviceData = await queryThird;
                    // console.log(`For service with id ${serviceList[j]}, this is the data`, serviceData);
                    servicesArray.push(serviceData);
                }
                
            }
            obj['services'] = servicesArray;
            modifiedData.push(obj);
        }

        res.status(200).json({status: '200', message: 'success', data: modifiedData});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'});
    }
}