const mongoose = require('mongoose');

const contactPointSchema = new mongoose.Schema(
    {
        system: {
            type: String,
            enum: ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'],
        },
        value: {
            type: String,
        },
        use: {
            type: String,
            enum: ['home', 'work', 'temp', 'old', 'mobile'],
        },
        rank: { // 1 highest
            type: Number,
            minumum: 1,
        },
        period: { // Time period when the contact point was/is in use
            start: { type: Date },
            end: { type: Date },
        },
    },
    { timestamps: true },
);


module.exports = { contactPointSchema };
