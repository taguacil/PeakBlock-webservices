const crypto = require('crypto');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var emailvalidator = require('email-validator');
const { Patient, validate } = require('../models/patient');

// Patient Registration.
exports.register = async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const valid = emailvalidator.validate(req.body.email);
    if (!valid) return res.status(400).send('Invalid Email!');

    let patient = await Patient.findOne({ email: req.body.email });
    if (patient) return res.status(400).send('Email already registered.');

    patient = new Patient(
        _.pick(req.body, [
        'name',
        'email',
        'password',
        'gender',
        'birthDate'
        ])
    );
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(patient.password, salt);
    const patientObj = new Patient(patient);
    await patientObj.save();

    res.send(_.pick(patient, ['_id', 'name', 'email']));
};
