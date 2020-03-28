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

const humanNameAJVSchema = {
    type: 'object',
    properties: {
        use: {
            type: 'string',
            enum: ['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'],
        },
        text: {
            type: 'string',
        },
        family: {
            type: 'string',
        },
        given: {
            type: 'string'
        },
        prefix: {
            type: 'string'
        },
        suffix: {
            type: 'string'
        },
        period: {
            type: 'object',
            properties: {
                start: {
                    type: 'string',
                    format: 'date-time',  
                },
                end: {
                    type: 'string',
                    format: 'date-time',
                    formatMinimum: {
                        $data: '1/start',
                    },
                },
            },
        },
    },
    additionalProperties: false,
};

module.exports = { humanNameSchema, humanNameAJVSchema };
