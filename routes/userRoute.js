const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

// USER-SIGNUP
router
.route('/signup')
.post(controller.Signup,controller.VerifyEmail);

// USER-LOGIN
router
.route('/login')
.post(controller.Login);

// Get List of Events & Add Event
router
.route('/event')
.post(controller.AddEvent) // post request for adding an event
.get(controller.GetEvents); // get request to get all events



module.exports = router;