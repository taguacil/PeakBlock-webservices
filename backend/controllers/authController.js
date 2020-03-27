const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async function authenticate(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
        if (err) return next(new Error(err));
        if (!user) return res.status(401).send(info);
        return req.login(user, { session: false }, async (error) => {
            if (error) return next(err);
            const body = {
                id: user.id,
                email: user.email,
                name: user.name
            };
            const token = jwt.sign({ user: body }, config.get('jwtPrivateKey'));
            return res.send({ id: user._id, token });
        });
    })(req, res, next);
};
