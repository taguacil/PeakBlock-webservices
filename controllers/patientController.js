/* eslint-disable no-await-in-loop */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const config = require('config');
const emailvalidator = require('email-validator');
const {
    Patient, validate, validateSymptoms, validateDetails,
} = require('../models/patient');
const { City } = require('../models/city');

// Patient Registration.
exports.register = async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const valid = emailvalidator.validate(req.body.email);
    if (!valid) return res.status(400).send('Invalid Email!');

    let patient = await Patient.findOne({ email: req.body.email });
    if (patient) return res.status(400).send('Email already registered.');

    patient = new Patient(
        _.pick(req.body, [
            'name',
            'email',
            'password',
            'gender',
            'birthDate',
        ]),
    );
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(patient.password, salt);
    const patientObj = new Patient(patient);
    await patientObj.save();

    res.send(_.pick(patient, ['_id', 'name', 'email']));
};

exports.get = async (req, res) => {
    if (!(req.user && req.user.role === 'patient')) return res.status(403).send({ message: 'Please Login!' });
    const patient = await Patient.findById(req.user.id);
    res.send(patient);
};

/*
{
    "symptoms": {
        "bodyTemperature": 37,
        "cough": true,
        "fatigue": false,
        "pain_in_throat": false,
        "dyspnea_at_rest": false,
        "headache": true,
        "diarrhea": false,
        "nausea": true,
        "loss_of_sense_of_smell": false,
        "chest_pain": false,
        "muscle_ache": false,
        "runny_nose": true,
        "confusion": false
    },
    "medical_conditions": [
        "diabetes", "heart problems"
    ],
    "excorona": true,
    "confirmedCases": 10
}
*/
exports.fillSymptoms = async (req, res) => {
    if (!(req.user && req.user.role === 'patient')) return res.status(403).send({ message: 'Please Login!' });

    const error = validateSymptoms(req.body);
    if (error) return res.status(400).send(error);

    const patient = await Patient.findByIdAndUpdate({ _id: req.user.id }, req.body);

    const city = await City.findOne({ name: req.body.address.city }); // TODO: api call to the population
    if (!city) return res.status(400).send({ message: 'Invalida City!' });
    const { population } = city;
    const count = (await Patient.find({ covid_probability: { $gt: 0.8 }, 'address.city': req.body.address.city })).length;

    const symptoms = {
        symptoms: req.body.observations,
        medical_conditions: req.body.medical_conditions,
        excorona: req.body.excorona,
        population,
        confirmedCases: count,
    };

    const pythonHost = config.get('pythonIP');
    axios.post(`http://${pythonHost}:5555/api/ai/diagnosis`, symptoms)
        .then(async (response) => {
            const probability = Number(response.data['COVID Probability']);
            patient.covid_probability = probability;
            await patient.save();

            return res.send({ patient });
        })
        .catch((err) => res.status(400).send({ message: 'Couldn\'t predict!' }));
};

exports.updateDetails = async (req, res) => {
    if (!(req.user && req.user.role === 'patient')) return res.status(403).send({ message: 'Please Login!' });

    const error = validateDetails(req.body);
    if (error) return res.status(400).send(error);

    const patient = await Patient.findByIdAndUpdate({ _id: req.user.id }, req.body, { new: true });

    res.send(patient);
};

const confirmed = async () => {
    const confirmedCases = await Patient.aggregate([
        {
            $match: {
                covid_probability: 1,
            },
        },
        {
            $group: {
                _id: '$address.city',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                city: '$_id',
                _id: 0,
                count: '$count',
            },
        },
    ]);

    for (let i = 0; i < confirmedCases.length; i += 1) {
        const city = await City.findOne({ name: confirmedCases[i].city });
        confirmedCases[i].population = city ? city.population : NaN;
        confirmedCases[i].lon = city ? city.lon : NaN;
        confirmedCases[i].lat = city ? city.lat : NaN;
    }
    return confirmedCases;
};

const highProbable = async () => {
    const highProbableCases = await Patient.aggregate([
        {
            $match: {
                covid_probability: { $gt: 0.8, $lt: 1 },
            },
        },
        {
            $group: {
                _id: '$address.city',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                city: '$_id',
                _id: 0,
                count: '$count',
            },
        },
    ]);

    for (let i = 0; i < highProbableCases.length; i += 1) {
        const city = await City.findOne({ name: highProbableCases[i].city });
        highProbableCases[i].population = city ? city.population : NaN;
        highProbableCases[i].lon = city ? city.lon : NaN;
        highProbableCases[i].lat = city ? city.lat : NaN;
    }
    return highProbableCases;
};

const recovered = async () => {
    const recoveredCases = await Patient.aggregate([
        {
            $match: {
                recovered: true,
            },
        },
        {
            $group: {
                _id: '$address.city',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                city: '$_id',
                _id: 0,
                count: '$count',
            },
        },
    ]);

    for (let i = 0; i < recoveredCases.length; i += 1) {
        const city = await City.findOne({ name: recoveredCases[i].city });
        recoveredCases[i].population = city ? city.population : NaN;
        recoveredCases[i].lon = city ? city.lon : NaN;
        recoveredCases[i].lat = city ? city.lat : NaN;
    }
    return recoveredCases;
};

const deceased = async () => {
    const deceasedCases = await Patient.aggregate([
        {
            $match: {
                deceased: { $exists: false },
            },
        },
        {
            $group: {
                _id: '$address.city',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                city: '$_id',
                _id: 0,
                count: '$count',
            },
        },
    ]);

    for (let i = 0; i < deceasedCases.length; i += 1) {
        const city = await City.findOne({ name: deceasedCases[i].city });
        deceasedCases[i].population = city ? city.population : NaN;
        deceasedCases[i].lon = city ? city.lon : NaN;
        deceasedCases[i].lat = city ? city.lat : NaN;
    }
    return deceasedCases;
};


exports.map = async (req, res) => {
    const confirmedCases = await confirmed();
    const highProbableCases = await highProbable();
    const recoveredCases = await recovered();
    const deceasedCases = await deceased();

    return res.send({
        confirmedCases, highProbableCases, recoveredCases, deceasedCases,
    });
};
