const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { User } = require('../models/user');

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user || !(await user.validPassword(password))) {
                    return done(null, false, {
                        message: 'Incorrect username or password',
                    });
                }
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (err) {
                return done(err);
            }
        },
    ),
);
