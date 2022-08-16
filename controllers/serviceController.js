const Service = require('../models/serviceModel');

// Add a Service (currently only for entering dummy data)
exports.AddService = async (req,res) => {
    try{
        const query = Service.create({
            name: req.body.name,
            rating: req.body.rating,
            numberOfRatings: req.body.numberOfRatings,
            remoteServices: req.body.remoteServices,
            onlineStatus: req.body.onlineStatus,
            responseTime: req.body.responseTime,
            location: req.body.location,
            cost: req.body.cost,
            image: req.body.image,
        });
        const addService = await query;

        res.status(201).json({status: '201', message: 'success'});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'});
    }
}

// Display the list of Services
exports.GetServices = async (req,res) => {
    try{
        const query = Service.find();
        const listServices = await query;

        res.status(200).json({status: '200', message: 'success', data: listServices});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'})
    }
}