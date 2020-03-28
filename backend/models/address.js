const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        use: {
            type: String,
            enum: ['home', 'work', 'temp', 'old', 'billing'],
        },
        type: {
            type: String,
            enum: ['postal', 'physical', 'both'],
        },
        text: { // Text representation of the address
            type: String,
        },
        line: [{ // Street name, number, direction & P.O. Box etc.
            type: String,
        }],
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        state: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        country: {
            type: String,
        },
        period: {
            start: { type: Date },
            end: { type: Date },
        },
    },
    { timestamps: true },
);


module.exports = { addressSchema };
