const express = require('express');
const controller = require('../controllers/serviceController');

const router = express.Router();

// Get List of Services & Add Service
router
.route('/')
.get(controller.GetServices)
.post(controller.AddService);


module.exports = router;