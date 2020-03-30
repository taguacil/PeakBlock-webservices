const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: String,
    countryCode: String,
    lon: Number,
    lat: Number,
    population: Number,
}, { timestamps: true });

const City = mongoose.model('city', citySchema);

module.exports = {
    City,
};
