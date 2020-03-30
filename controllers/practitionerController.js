const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const emailvalidator = require('email-validator');
const { Practitioner, validateRegistration } = require('../models/practitioner');
const { PractitionerRole } = require('../models/practitionerRole');
const { Patient, validate, validateSymptoms } = require('../models/patient');
const { Organization } = require('../models/organization');
const { HealthcareService } = require('../models/healthcareService');

exports.login = async function authenticate(req, res, next) {
    passport.authenticate('practitioner-login', async (err, user, info) => {
        if (err) return next(new Error(err));
        if (!user) return res.status(401).send(info);
        return req.login(user, { session: false }, async (error) => {
            if (error) return next(err);
            const body = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: 'practitioner',
            };
            const token = jwt.sign({ user: body }, config.get('jwtPrivateKey'));
            return res.send({ id: user._id, token });
        });
    })(req, res, next);
};

// Practitioner Registration.
exports.register = async (req, res) => {
    const error = validateRegistration(req.body);
    if (error) return res.status(400).send(error);

    const valid = emailvalidator.validate(req.body.email);
    if (!valid) return res.status(400).send('Invalid Email!');

    let practitioner = await Practitioner.findOne({ email: req.body.email });
    if (practitioner) return res.status(400).send('Email already registered.');

    req.body.name = [{ text: req.body.name }];
    practitioner = new Practitioner(
        _.pick(req.body, [
            'name',
            'email',
            'password',
            'birthDate',
            'gender',
        ]),
    );
    const salt = await bcrypt.genSalt(10);
    practitioner.password = await bcrypt.hash(practitioner.password, salt);
    await practitioner.save();

    res.send(_.pick(practitioner, ['_id', 'name', 'email']));
};

exports.get = async (req, res) => {
    if (!(req.user && req.user.role === 'practitioner')) return res.status(403).send({ message: 'You are not authorized!' });
    const practitioner = await Practitioner.findById(req.user.id);
    return res.send(practitioner);
};

exports.addPatient = async (req, res) => {
    if (!(req.user && req.user.role === 'practitioner')) return res.status(403).send({ message: 'You are not authorized!' });
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
            'birthDate',
        ]),
    );
    patient.generalPractitioner.push(req.user.id);
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(patient.password, salt);
    const patientObj = new Patient(patient);
    await patientObj.save();

    res.send(patient);
};

exports.viewRoles = async (req, res) => {
    if (!(req.user && req.user.role === 'practitioner')) return res.status(403).send({ message: 'You are not authorized!' });
    const roles = await PractitionerRole.find({ practitioner: req.user.id });

    res.send(roles);
};

exports.assignPatient = async (req, res) => {
    if (!(req.user && req.user.role === 'practitioner')) return res.status(403).send({ message: 'You are not authorized!' });
    const organization = await Organization.findById(req.params.organization);
    if (!organization) return res.status(400).send({ message: 'Organization does not exist!' });
    const healthcareService = await HealthcareService.findById(req.params.healthcareService);
    if (!healthcareService) return res.status(400).send({ message: 'Organization does not exist!' });

    const practitionerRole = await PractitionerRole.findOne({
        practitioner: req.user.id,
        organization: req.params.organization,
        healthcareService: req.params.healthcareService,
    });

    if (!practitionerRole) return res.status(400).send({ message: 'You are not assigned to this service with this organization' });
    const { patientMail } = req.body;
    const patient = Patient.findOne({ email: patientMail });
    const exists = patient.generalPractitioner.includes(practitionerRole.id);
    if (exists) return res.status(400).send({ message: 'Already assigned!' });
    patient.generalPractitioner.push(practitionerRole.id);
    await patient.save();

    return res.send({ message: 'Patient assigned successfully!' });
};

exports.fillPatientSymptoms = async (req, res) => {
    if (!(req.user && req.user.role === 'practitioner')) return res.status(403).send({ message: 'You are not authorized!' });

    let patient = await Patient.findById(req.params.patient);
    if (!patient) return res.status(404).send({ message: 'Must register first!' });

    const exist = patient.generalPractitioner.includes(req.user.id);
    if (!exist) return res.status(400).send({ message: 'Please assign the patient to the practitioner first!' });

    const error = validateSymptoms(req.body);
    if (error) return res.status(400).send(error);

    if (req.body.covid_probability !== 0 || req.body.covid_probability !== 1) return res.status(400).send({ message: 'Please enter a valid covid result!' });

    patient = await Patient.findByIdAndUpdate({ _id: req.params.patient }, req.body);
    return res.send(patient);
};
