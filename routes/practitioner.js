const express = require('express');

const router = express.Router();

const practitionerController = require('../controllers/practitionerController');

router.post('/login', practitionerController.login);
router.post('/', practitionerController.register);
router.get('/', practitionerController.get);

module.exports = router;
