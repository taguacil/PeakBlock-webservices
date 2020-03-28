const mongoose = require('mongoose');

const codingSchema = new mongoose.Schema(
    {
        system: {
            type: String,
            validator: function isURIValid(v) {
                return /\w+:(\/?\/?)[^\s]+/.test(v);
            },
            message: (props) => `${props.value} is not a valid uri.`,
        },
        version: {
            type: String,
        },
        code: {
            type: String,
        },
        display: {
            type: String,
        },
        userSelected: {
            type: Boolean,
        },
    },
);

const codingAJVSchema = {
    type: 'object',
    properties: {
        system: {
            type: 'string',
            pattern: '\w+:(\/?\/?)[^\s]+',
        },
        version: {
            type: 'string',
        },
        code: {
            type: 'string',
        },
        display: {
            type: 'string',
        },
        userSelected: {
            type: 'boolean',
        },
    },
}

module.exports = { codingSchema, codingAJVSchema };
