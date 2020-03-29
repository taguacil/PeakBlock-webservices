const mongoose = require('mongoose');
const { codingSchema, codingAJVSchema } = require('./coding');

const codeableConceptSchema = new mongoose.Schema(
    {
        coding: [codingSchema],
        text: {
            type: String,
        },
    },
);

const codeableConceptAJVSchema = {
    type: 'object',
    properties: {
        coding: {
            type: 'array',
            items: codingAJVSchema,
        },
        text: {
            type: 'string'
        },
    },
};

module.exports = { codeableConceptSchema, codeableConceptAJVSchema };
