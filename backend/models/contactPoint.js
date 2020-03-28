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
);

const contactPointAJVSchema = {
    type: 'object',
    properties: {
        system: {
            type: 'string',
            enum: ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'],
        },
        value: {
            type: 'string',
        },
        use: {
            type: 'string',
            enum: ['home', 'work', 'temp', 'old', 'mobile'],
        },
        rank: {
            type: 'number',
            minimum: 1,
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

module.exports = { contactPointSchema, contactPointAJVSchema };
