const crypto = require('crypto');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var emailvalidator = require('email-validator');
const { Patient, validate, validateSymptoms, validateDetails } = require('../models/patient');

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

exports.get = async (req, res) => {
    if (!req.user) return res.status(403).send({ message: 'Please Login!' });
    const patient = await Patient.findById(req.user.id);
    res.send(patient);
}

exports.fillSymptoms = async (req, res) => {
    if (!req.user) return res.status(403).send({ message: 'Please Login!' });

    const error = validateSymptoms(req.body);
    if (error) return res.status(400).send(error);

    const patient = await Patient.findByIdAndUpdate({ _id: req.user.id }, req.body);
    
    let probability = 'possible'; // TODO: CALL ML MODEL THAT RETURNS THE PROBABILITY THAT THIS USER IS A COVID 19 PATIENT
    patient.covid_state = probability;
    await patient.save();

    res.send(patient);
};

exports.updateDetails = async (req, res) => {
    if (!req.user) return res.status(403).send({ message: 'Please Login!' });

    const error = validateDetails(req.body);
    if (error) return res.status(400).send(error);

    const patient = await Patient.findByIdAndUpdate({ _id: req.user.id }, req.body, { new: true });
    console.log(patient);

    res.send(patient);
};
