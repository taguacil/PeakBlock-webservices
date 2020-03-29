const mongoose = require('mongoose');
const { codeableConceptSchema } = require('./codeableConcept');

const identifierSchema = new mongoose.Schema(
    {
        use: {
            type: String,
            enum: ['usual', 'official', 'temp', 'secondary', 'old'],
        },
        type: codeableConceptSchema,
        system: {
            type: String,
            validator: function isURIValid(v) {
                return /\w+:(\/?\/?)[^\s]+/.test(v);
            },
            message: (props) => `${props.value} is not a valid uri.`,
        },
        value: {
            type: String,
        },
        period: {
            start: { type: Date },
            end: { type: Date },
        },
        assigner: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    },
);


module.exports = { identifierSchema };
