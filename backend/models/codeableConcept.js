const mongoose = require('mongoose');
const { codingSchema } = require('./coding');

const codeableConceptSchema = new mongoose.Schema(
    {
        coding: [codingSchema],
        text: {
            type: String,
        },
    },
);


module.exports = { codeableConceptSchema };
