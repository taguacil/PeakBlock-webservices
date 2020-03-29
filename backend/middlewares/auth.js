const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('config');
const passport = require('passport');
const { Patient } = require('../models/patient');
const { Organization } = require('../models/organization');

const jwtPrivateKey = config.get('jwtPrivateKey');

passport.use(
    new JWTStrategy(
        {
            secretOrKey: jwtPrivateKey,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        // eslint-disable-next-line consistent-return
        async (token, done) => {
            try {
                if (token.user.role === 'patient') {
                    const patient = await Patient.findById(token.user.id);
                    if (!patient) {
                        return done(null, false, { message: 'User not found' });
                    }
                    return done(null, token.user);
                } else if (token.user.role === 'organization') {
                    const organization = await Organization.findById(token.user.id);
                    if (!organization) {
                        return done(null, false, { message: 'User not found' });
                    }
                    return done(null, token.user);
                }
                
            } catch (err) {
                return done(err);
            }
        },
    ),
);

module.exports = function authenticate(req, res, next) {
    passport.authenticate(
        'jwt',
        {
            session: false,
        },
        (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (info) {
                if (info.message === 'No auth token') {
                    return next(null, false);
                }
                if (
                    info.message === 'jwt malformed'
                    || info.message === 'invalid signature'
                ) {
                    return res
                        .status(401)
                        .send({ message: 'Token is invalid' });
                }
                if (info.message === 'User not found') {
                    return res.status(401).send(info);
                }
            }
            req.user = user;
            return next(null, user);
        },
    )(req, res, next);
};
