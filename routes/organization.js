const express = require('express');
const organizationController = require('../controllers/organizationController');

const router = express.Router();

router.post('/login', organizationController.login);
router.post('/', organizationController.register);
router.get('/', organizationController.get);
router.post('/addPractitioner', organizationController.addPractitoner);
router.post('/addHealthcareService', organizationController.addHealthcareService);
router.put('/addRole/:practitioner', organizationController.addPractitonerRole);
router.get('/viewPracitioners', organizationController.viewPractitioners);

module.exports = router;
