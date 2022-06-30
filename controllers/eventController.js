const Event = require('../models/eventModel');


// Get List of Events
exports.GetEvents = async (req,res) => {
    try{
        const query = Event.find();
        const getEvents = await query;

        res.status(200).json({status: '200', message: 'success', data: getEvents});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: "404", message: 'fail'});
    }
}

exports.AddEvent = async (req,res) => {
    try{
        
        const query = Event.create({
            eventName: req.body.eventName,
            eventImage: req.body.eventImage
        })
        const addEvent = await query;
        res.status(201).json({status:'201', message: 'success'});
    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail'});
    }
}