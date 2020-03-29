const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var emailvalidator = require('email-validator');
const { Organization } = require('../models/organization');
const { Practitioner } = require('../models/practitioner');
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
    // TODO:
    // const error = validate(req.body);
    // if (error) return res.status(400).send(error);

    const valid = emailvalidator.validate(req.body.email);
    if (!valid) return res.status(400).send('Invalid Email!');

    let organization = await Organization.findOne({ email: req.body.email });
    if (organization) return res.status(400).send('Email already registered.');

    organization = new Organization(
        _.pick(req.body, [
        'name',
        'email',
        'password',
        ])
    );
    const salt = await bcrypt.genSalt(10);
    organization.password = await bcrypt.hash(organization.password, salt);
    await organization.save();

    res.send(_.pick(organization, ['_id', 'name', 'email']));
};

exports.get = async (req, res) => {
    if (!(req.user && req.user.role === 'organization')) return res.status(403).send({ message: 'You are not authorized' });
    const organization = await Organization.findById(req.user.id);
    return res.send(organization)
};
