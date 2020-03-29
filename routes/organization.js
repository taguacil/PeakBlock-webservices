const express = require('express');
const organizationController = require('../controllers/organizationController');

const router = express.Router();

router.post('/login', organizationController.login);
router.post('/', organizationController.register);
router.get('/', organizationController.get)

module.exports = router;
