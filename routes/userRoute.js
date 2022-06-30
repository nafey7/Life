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

// VIEW & ADD REGISTRY
router
.route('/registries')
.get(controller.ViewRegistries)
.post(controller.AddRegistry)
.delete(controller.DeleteRegistry);




module.exports = router;