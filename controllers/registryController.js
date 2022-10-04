const Registry = require('../models/registryModel');

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
        const registryID = req.body.registryID;
        
        const query = Registry.findById(registryID);
        const findPrivateRegistry = await query;

        res.status(200).json({status: '200', message: 'success', data: findPrivateRegistry});
    }
    catch(err){
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}