const express = require('express');

const router = express.Router();

const practitionerController = require('../controllers/practitionerController');

router.post('/login', practitionerController.login);
router.post('/', practitionerController.register);
router.get('/', practitionerController.get);
router.post('/addPatient', practitionerController.addPatient);
router.get('/viewRoles', practitionerController.viewRoles);
router.put('/assignPatient/:organization/', practitionerController.assignPatient);
router.put('/fillPatientSymptoms/:patient', practitionerController.fillPatientSymptoms);
router.put('/toggleRecovered/:patient', practitionerController.toggleRecovered);
router.put('/markDead/:patient', practitionerController.markAsDead);
router.get('/viewPatient', practitionerController.viewPatient);

module.exports = router;
