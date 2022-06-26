const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router
.route('/registry')
.post(controller.CreateRegistry);

module.exports = router;