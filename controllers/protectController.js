const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.Protect = async (req,res, next) => {
    try{
        let token;

        if (!req.body.token){
            throw new Error ('Token is not present');
        }
        token = req.body.token

        const match = await jwt.verify (token, 'life-secret');
        
        const query = User.findById(match.id);
        const UserFound = await query;

        if (!UserFound){
            throw new Error ('No such user exists');
        }

        // next();
        res.status(200).json({status: '200', message: 'success'})



    }
    catch(err){
        console.log(err);
        res.status(404).json({status: '404', message: 'fail', data: err.message});
    }
}