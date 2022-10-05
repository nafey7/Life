const Registry = require('../models/registryModel');
const User = require('../models/userModel');
const Service = require ('../models/serviceModel');

// View all public registries
exports.ViewAllRegistries = async (req,res) => {
    try {
        const query = Registry.find({private:false});
        const ViewAllRegistries = await query;

        res.status(200).json({status: '200', message: 'success', data: ViewAllRegistries});

    }
    catch(err){
        console.log(err);res.status(404).json({status: '404', message: 'fail', data: err.message});

    }
}

// Search for public registry by name
exports.SearchPublicRegistry = async (req,res) => {
    try{
        const searchName = req.body.searchName;
        const query = Registry.find({registryName: searchName, private: false});
        const searchResult = await query;

        if (searchResult.length == 0){
            res.status(200).json({status: '200', message: 'success', data: 'No Results Found'});
        }
        else{
            res.status(200).json({status: '200', message: 'success', data: searchResult});
        }

    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}

exports.ViewPrivateRegistry = async (req,res) => {
    try{

        let finalObject = {};
        let finalRegistry = {};
        
        const registryID = req.body.registryID;
        const userID = req.body.userID;
        
        const query = Registry.findById(registryID);
        const findPrivateRegistry = await query;

        let serviceArray = findPrivateRegistry.service;
        let serviceInfo = [];
        
        finalRegistry._id = findPrivateRegistry._id;
        finalRegistry.registryName = findPrivateRegistry.registryName;
        finalRegistry.userID = findPrivateRegistry.userID;
        finalRegistry.eventID = findPrivateRegistry.eventID;
        finalRegistry.link = findPrivateRegistry.link;
        finalRegistry.private = findPrivateRegistry.private;
        finalRegistry.image = findPrivateRegistry.image;
        finalRegistry.creationDate = findPrivateRegistry.creationDate;
        finalRegistry.createdAt = findPrivateRegistry.createdAt;
        finalRegistry.updatedAt = findPrivateRegistry.updatedAt;
        

        let queryService, findService
        for (let i=0;i<serviceArray.length;i++){
            queryService = Service.findOne({_id: serviceArray[i]});
            findService = await queryService;

            serviceInfo.push(findService);

        }
        finalRegistry.service = serviceInfo;

        const querySecond = User.findById(userID);
        const userData = await querySecond;

        finalObject.user = userData;
        finalObject.registry = finalRegistry;

        res.status(200).json({status: '200', message: 'success', data: finalObject});
    }
    catch(err){
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}