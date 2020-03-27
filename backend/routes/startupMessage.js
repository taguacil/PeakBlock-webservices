const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ Message: 'Welcome to Peak Block API', dbConnection: mongoose.connection.readyState });
});
module.exports = router;
