const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

// Signup User
router
.route('/registry')
.post(controller.CreateRegistry,controller.VerifyEmail);

// Login
router
.route('/login')
.post(controller.Login);

// Event Create
// router
// .route('/event')
// .post(controller.EventatSignup)

module.exports = router;