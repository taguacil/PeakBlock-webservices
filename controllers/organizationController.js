const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const emailvalidator = require('email-validator');
const { Organization, validateRegistration } = require('../models/organization');
const { Practitioner, validateRegistration: validatePractitioner } = require('../models/practitioner');
const { PractitionerRole } = require('../models/practitionerRole');
const { HealthcareService } = require('../models/healthcareService');

exports.login = async function authenticate(req, res, next) {
    passport.authenticate('organization-login', async (err, user, info) => {
        if (err) return next(new Error(err));
        if (!user) return res.status(401).send(info);
        return req.login(user, { session: false }, async (error) => {
            if (error) return next(err);
            const body = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: 'organization',
            };
            const token = jwt.sign({ user: body }, config.get('jwtPrivateKey'));
            return res.send({ id: user._id, token });
        });
    })(req, res, next);
};

// Organization Registration.
exports.register = async (req, res) => {
    const error = validateRegistration(req.body);
    if (error) return res.status(400).send(error);

    const valid = emailvalidator.validate(req.body.email);
    if (!valid) return res.status(400).send('Invalid Email!');

    let organization = await Organization.findOne({ email: req.body.email });
    if (organization) return res.status(400).send('Email already registered.');

    organization = new Organization(
        _.pick(req.body, [
            'name',
            'email',
            'password',
        ]),
    );
    const salt = await bcrypt.genSalt(10);
    organization.password = await bcrypt.hash(organization.password, salt);
    await organization.save();

    return res.send(_.pick(organization, ['_id', 'name', 'email']));
};

exports.get = async (req, res) => {
    if (!(req.user && req.user.role === 'organization')) return res.status(403).send({ message: 'You are not authorized' });
    const organization = await Organization.findById(req.user.id);
    return res.send(organization);
};


exports.addPractitoner = async (req, res) => {
    if (!(req.user && req.user.role === 'organization')) return res.status(403).send({ message: 'You are not authorized' });
    // TODO: data validation
    let practitioner = await Practitioner.findOne({ email: req.body.email });
    if (practitioner) return res.status(400).send('Email already registered.');

    practitioner = new Practitioner(
        _.pick(req.body, [
            'name',
            'email',
            'password',
        ]),
    );
    const salt = await bcrypt.genSalt(10);
    practitioner.password = await bcrypt.hash(practitioner.password, salt);
    await practitioner.save();

    return res.send(_.pick(practitioner, ['_id', 'name', 'email']));
};

exports.addPractitonerRole = async (req, res) => {
    if (!(req.user && req.user.role === 'organization')) return res.status(403).send({ message: 'You are not authorized' });
    // TODO: data validation
    const practitioner = await Practitioner.findById(req.body.practitioner);
    if (!practitioner) return res.status(404).send({ message: 'Such practitioner does not exist. Please add pracititioner, then add the role!' });
    const healthcareService = await HealthcareService.findById(req.body.healthcareService);
    if (!healthcareService) return res.status(404).send({ message: 'Such healthcare service does not exist. Please add pracititioner, then add the role!' });

    req.body.organization = req.user.id;
    req.body.practitioner = req.params.practitioner;
    const practitionerRole = new PractitionerRole(req.body);
    await practitionerRole.save();

    res.send(practitionerRole);
};

exports.addHealthcareService = async (req, res) => {
    if (!(req.user && req.user.role === 'organization')) return res.status(403).send({ message: 'You are not authorized' });
    // TODO: data validation
    req.body.providedBy = req.user.id;
    const healthcareService = new HealthcareService(req.body);
    await healthcareService.save();

    res.send(healthcareService);
};

exports.viewPractitioners = async (req, res) => {
    if (!(req.user && req.user.role === 'organization')) return res.status(403).send({ message: 'You are not authorized' });
    const practitioners = await PractitionerRole.find({ organization: req.user.id })
        .select('practitioner')
        .populate(
            {
                path: 'practitioner',
                model: Practitioner,
            },
        );

    res.send(practitioners);
};
