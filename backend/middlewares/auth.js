const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('config');
const passport = require('passport');
const { User } = require('../models/user');

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
                const user = await User.findById(token.user.id);
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                if (!user.email.isVerified || user.email.address !== token.user.email) {
                    return done(null, false, { message: 'Verification Required' });
                }
                return done(null, token.user);
            } catch (err) {
                return done(err);
            }
        },
    ),
);

module.exports = function authenticateUser(req, res, next) {
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
                if (info.message === 'Verification Required') {
                    return res.status(401).send({ message: 'Please Verify your email, then re-login' });
                }
            }
            req.user = user;
            return next(null, user);
        },
    )(req, res, next);
};
