const app = require('express')();
const http = require('http').createServer(app);
const winston = require('winston');

require('./startup/logging')();
require('./startup/db')();
require('./startup/auth');
require('./startup/routes')(app);

const PORT = process.env.PORT || 3000;
const server = http.listen(PORT, () => {
    winston.info(`Listening to port ${PORT}`);
});
module.exports = server;
