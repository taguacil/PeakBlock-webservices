/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
const winston = require('winston');

require('../startup/db')();

/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const faker = require('faker');
const bcrypt = require('bcrypt');

const { Patient } = require('../models/patient');
const { City } = require('../models/city');

const conditions = ['Chronic cardiac disease  including congenital heart disease (not hypertension)',
    'Chronic pulmonary disease (not asthma)',
    'Asthma (physician diagnosed)',
    'Chronic kidney disease',
    'Moderate or severe liver disease',
    'Mild liver disease',
    'Chronic neurological disorder',
    'Malignant neoplasm',
    'Chronic hematologic disease',
    'AIDS ',
    'Obesity (as defined by clinical staff)',
    'Diabetes with complications',
    'Diabetes without complications',
    'Rheumatologic disorder',
    'Dementia',
    'Malnutrition',
    'Smoking',
    'Other relevant risk factor'];

(async function () {
    try {
        fs.readFile('./seed/patients.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log('File read failed:', err);
                return;
            }
            const patients = JSON.parse(jsonString);

            await Patient.remove({}); // clear all users

            for (let i = 0; i < patients.length; i += 1) {
                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash('123456789', salt);
                const email = faker.internet.exampleEmail();
                const name = `${faker.name.firstName()}${faker.name.lastName()}`;
                const covid_probability = patients[i].Covid === 'YES' ? 1 : 0;
                const gender = patients[i]['Sex at Birth:'] === 'Male' ? 'male' : 'female';

                const age_years = Number(patients[i]['Estimated Age (years)']);
                const date = new Date();
                date.setFullYear(date.getFullYear() - age_years);
                const birthDate = new Date(date);
                const medical_conditions = [];

                for (let j = 0; j < conditions.length; j += 1) {
                    if (patients[i][conditions[j]] === 'YES') medical_conditions.push(conditions[j]);
                }

                const observations = {
                    body_temperature: patients[i]['Temperature - Unit:'],
                    cough: patients[i]['Cough - bloody sputum: haemoptysis'] === 'YES',
                    fatigue: patients[i]['Fatigue '][' Malaise'] === 'YES',
                    pain_in_throat: patients[i]['Sore throat'] === 'YES',
                    dyspnea_at_rest: patients[i]['Shortness of breath (Dyspnea)'] === 'YES',
                    headache: patients[i]['Headache'] === 'YES',
                    diarrhea: patients[i]['Diarrhoea'] === 'YES',
                    nausea: patients[i]['Vomiting '][' Nausea'] === 'YES',
                    // loss_of_sense_of_smell: patients[i][''] === 'YES',
                    chest_pain: patients[i]['Chest pain'] === 'YES',
                    muscle_ache: patients[i]['Muscle aches (Myalgia)'] === 'YES',
                    runny_nose: patients[i]['Runny nose (Rhinorrhoea)'] === 'YES',
                    confusion: patients[i]['Altered consciousness']['confusion'] === 'YES',
                };

                const patientObj = {
                    name,
                    password,
                    email,
                    covid_probability,
                    gender,
                    birthDate,
                    medical_conditions,
                    observations,
                };

                const patient = new Patient(patientObj);
                await patient.save();
                console.log('done');
            }

            fs.readFile('./seed/swiss-cities.json', 'utf8', async (err2, jsonString2) => {
                if (err) {
                    console.log('File read failed:', err2);
                    return;
                }
                const cities = JSON.parse(jsonString2);
                console.log('start cities');
                await City.remove({}); // clear all users
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
                    console.log('done');
                }
                mongoose.connection.close();
            });
        });
    } catch (err) {
        winston.error(err.message, err);
    }
}());
