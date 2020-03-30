
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const error = require('../middlewares/error');
const authToken = require('../middlewares/auth');
const startupMessage = require('../routes/startupMessage');
const authUserPassword = require('../routes/auth');
const patients = require('../routes/patient');
const organizations = require('../routes/organization');
const practitioners = require('../routes/practitioner');

module.exports = function initRoutes(app) {
    app.use(cors());
    app.use(express.json());
    app.use(passport.initialize());
    app.use(authToken);
    app.use('/', startupMessage);
    app.use('/api/node/login', authUserPassword);
    app.use('/api/node/patients', patients);
    app.use('/api/node/organizations', organizations);
    app.use('/api/node/practitioners', practitioners);
    app.use(error);
};
