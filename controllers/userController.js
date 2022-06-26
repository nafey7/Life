const User = require('../models/userModel');

exports.CreateRegistry = async (req,res) => {
    try{
        const query = User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            event: req.body.event,
            feeling: req.body.feeling
        });

        const CreateRegistry = await query;
        res.status(201).json({status: 'success', message: CreateRegistry});
    }
    catch(err){
        res.status(404).json({status: 'fail', message: err.message});
    }
}