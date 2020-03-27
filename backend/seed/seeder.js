const mongoose = require('mongoose');
const winston = require('winston');
const { initDB } = require('../startup/db');

initDB();

const createCategories = require('./category-seeder');
const createUsers = require('./user-seeder');
const createServicePoints = require('./servicePoint-seeder');

(async function () {
    try {
        await createCategories();
        await createUsers();
        await createServicePoints();
        mongoose.connection.close(); // close DB connection
    } catch (err) {
        winston.error(err.message, err);
    }
}());
