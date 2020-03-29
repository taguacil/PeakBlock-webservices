const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { Patient } = require('../models/patient');
const { Organization } = require('../models/organization');

passport.use(
    'patient-login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {                
                const patient = await Patient.findOne({ email });
                if (!patient || !(await patient.validPassword(password))) {
                    return done(null, false, {
                        message: 'Incorrect username or password',
                    });
                }
                return done(null, patient, { message: 'Logged in Successfully' });
            } catch (err) {
                return done(err);
            }
        },
    ),
);

passport.use(
    'organization-login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {                
                const organization = await Organization.findOne({ email });
                if (!organization || !(await organization.validPassword(password))) {
                    return done(null, false, {
                        message: 'Incorrect username or password',
                    });
                }
                return done(null, organization, { message: 'Logged in Successfully' });
            } catch (err) {
                return done(err);
            }
        },
    ),
);
