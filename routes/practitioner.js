const express = require('express');

const router = express.Router();

const practitionerController = require('../controllers/practitionerController');

router.post('/login', practitionerController.login);
router.post('/', practitionerController.register);
router.get('/', practitionerController.get);
router.post('/addPatient', practitionerController.addPatient);
router.get('/viewRoles', practitionerController.viewRoles);
router.put('/assignPatient/:organization/:healthcaseService', practitionerController.assignPatient);
router.put('/fillPatientSymptoms/:patient', practitionerController.fillPatientSymptoms);

module.exports = router;
