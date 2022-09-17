const express = require('express');
const controller = require('../controllers/userController');
const protectController = require('../controllers/protectController');


const router = express.Router();


// USER-SIGNUP
router
.route('/signup')
.post(controller.Signup,controller.VerifyEmail);

// USER-LOGIN
router
.route('/login')
.post(controller.Login);

// ACCOUNT SETTINGS
router
.route('/accountsettings')
.post(protectController.Protect, controller.AccountSettings);


// VIEW & EDIT & ADD & DELETE REGISTRY
router
.route('/registries')
.get(protectController.Protect,controller.ViewRegistries)
.patch(protectController.Protect, controller.EditRegistry)
.post(protectController.Protect,controller.AddRegistry)
.delete(protectController.Protect,controller.DeleteRegistry);

// VIEW SINGLE SPECIFIC REGISTRY
router
.route('/specificRegistry')
.get(protectController.Protect,controller.SpecificRegistry);

// GENERATE LINK OF REGISTRY
router
.route('/registryLink')
.post(protectController.Protect,controller.GenerateLink);

// ADD SERVICE TO THE REGISTRY
router
.route('/addservice')
.patch(protectController.Protect,controller.AddServiceToRegistry);

// DELETE SERVICE FROM THE REGISTRY
router
.route('/deleteservice')
.patch(protectController.Protect,controller.DeleteServiceFromRegistry)


module.exports = router;