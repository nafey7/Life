const express = require('express');
const controller = require('../controllers/userController');
const protectController = require('../controllers/protectController');


const router = express.Router();


router
.route('/check')
.post(protectController.Protect);

// USER-SIGNUP
router
.route('/signup')
.post(controller.Signup,controller.VerifyEmail);

// USER-LOGIN
router
.route('/login')
.post(controller.Login);

// CHANGE PROFILE IMAGE
router
.route('/changeImage')
.patch(controller.ChangeProfileImage);


// VIEW & ADD & DELETE REGISTRY
router
.route('/registries')
.get(controller.ViewRegistries)
.post(controller.AddRegistry)
.delete(controller.DeleteRegistry);

// VIEW SINGLE SPECIFIC REGISTRY
router
.route('/specificRegistry')
.get(controller.SpecificRegistry);

// GENERATE LINK OF REGISTRY
router
.route('/registryLink')
.post(controller.GenerateLink);

// CHANGE PRIVACY OF REGISTRY
router
.route('/registryPrivacy')
.patch(controller.ChangePrivacy);


module.exports = router;