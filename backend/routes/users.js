const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/', userController.register);
router.get('/user/:nationalId', userController.getUserID);
router.get('/user/isVerified/:userId', userController.getIsUserVerified);
router.get('/confirmation/:email/:token', userController.confirmEmail);
router.post('/resend', userController.resendToken);
router.get('/settings/personal', userController.viewPersonalData);
router.put('/settings/email', userController.updateMail);
router.put('/settings/mobile', userController.updateMobile);
router.put('/settings/address', userController.updateAddress);
router.put('/settings/password', userController.changePassword);
router.put('/verifyUpdatedMail/:token', userController.verifyUpdatedMail);
router.get('/invitedUsers', userController.getInvitedUsers);
router.get('/usersNeedVerification', userController.getUsersNeedVerification);

module.exports = router;
