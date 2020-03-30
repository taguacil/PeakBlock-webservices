/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
const winston = require('winston');
const fs = require('fs');
const { City } = require('../models/city');

require('../startup/db')();

(async function () {
    try {
        fs.readFile('./seed/swiss-cities.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log('File read failed:', err);
                return;
            }
            const cities = JSON.parse(jsonString);
            console.log(cities);

            for (let i = 0; i < cities.length; i += 1) {
                const cityObj = {
                    name: cities[i].AccentCity,
                    countryCode: cities[i].Country,
                    lat: cities[i].Latitude,
                    lon: cities[i].Longitude,
                    population: cities[i].Population,
                };

                const city = new City(cityObj);
                await city.save();
            }
            mongoose.connection.close();
            console.log('done');
        });
    } catch (err) {
        winston.error(err.message, err);
    }
}());
