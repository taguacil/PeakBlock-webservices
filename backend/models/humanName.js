const mongoose = require('mongoose');

const humanNameSchema = new mongoose.Schema(
    {
        use: {
            type: String,
            enum: ['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'],
        },
        text: { // text representation of the full name
            type: String,
        },
        family: {
            type: String,
        },
        given: { // Given names (not always 'first'). Includes middle names
            type: String,
        },
        prefix: {
            type: String,
        },
        suffix: {
            type: String,
        },
        period: { // Time period when name was/is in use
            start: { type: Date },
            end: { type: Date },
        },
    },
);


module.exports = { humanNameSchema };
