const mongoose = require('mongoose');

const codeableConceptSchema = new mongoose.Schema(
    {
        coding: [{
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
        }],
        text: {
            type: String,
        },
    },
    { timestamps: true },
);


module.exports = { codeableConceptSchema };
