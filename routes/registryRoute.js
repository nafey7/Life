const express = require('express');
const controller = require('../controllers/registryController');

const router = express.Router();


router
.route('/')
.get(controller.ViewAllRegistries);

router
.route('/search')
.post(controller.SearchPublicRegistry);

router
.route('/private/registry')
.post(controller.ViewPrivateRegistry);



module.exports = router;