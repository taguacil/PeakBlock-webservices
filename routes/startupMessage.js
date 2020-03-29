const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
    res.send({ Message: 'Welcome to Peak Block API', dbConnection: mongoose.connection.readyState });
});

router.get('/test', (req, res) => {
    // setInterval(() => {} , 5*1000);
    axios.get('http://localhost:5555/api/ai/home')
        .then(response => {
            console.log(response.data);
            res.send(response.data);
            // res.write(response.data, encoding='utf8')
        })
        .catch(error => {
            console.log('ERROOOORRRR');    
            console.log(error);
        });
});

module.exports = router;
