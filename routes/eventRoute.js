const express = require('express');
const controller = require('../controllers/eventController');

const router = express.Router();

// Get List of Events & Add Event
router
.route('/')
.post(controller.AddEvent)
.get(controller.GetEvents);



module.exports = router;