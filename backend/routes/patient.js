const express = require('express');

const router = express.Router();

const patientController = require('../controllers/patientController');

router.post('/', patientController.register);
router.get('/', patientController.get);
router.post('/symptoms', patientController.fillSymptoms);

module.exports = router;
