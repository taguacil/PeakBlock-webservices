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
);

const addressAJVSchema = {
    type: 'object',
    properties: {
        'use': {
            type: 'string',
            enum: ['home', 'work', 'temp', 'old', 'billing'],
        },
        'type': {
            type: 'string',
            enum: ['postal', 'physical', 'both'],
        },
        'text': { // Text representation of the address
            type: 'string',
        },
        'line': {
            type: 'array',
            items: {
                type: 'string',
            }
        },
        'city': {
            type: 'string',
        },
        'district': {
            type: 'string',
        },
        'state': {
            type: 'string',
        },
        'postalCode': {
            type: 'string',
        },
        'country': {
            type: 'string',
        },
        'period': {
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

module.exports = { addressSchema, addressAJVSchema };
