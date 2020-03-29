const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = async function() {
    // const db = 'mongodb://localhost/PeakBlock';
    const db = config.get('db');
    mongoose.set('useNewUrlParser', true);
    mongoose.connect(db).then(() => winston.info(`Connect to ${db} .....`));
};
