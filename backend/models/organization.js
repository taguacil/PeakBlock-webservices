const mongoose = require('mongoose');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { humanNameSchema } = require('./humanName');

const organizationSchema = new mongoose.Schema(
    {
        active: {
            type: Boolean,
        },
        type: [codeableConceptSchema],
        name: {
            type: String,
        },
        alias: [{
            type: String,
        }],
        telecom: [contactPointSchema],
        address: [addressSchema],
        partof: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        contact: [{
            purpose: codeableConceptSchema,
            name: humanNameSchema,
            telecom: [contactPointSchema],
            address: addressSchema,
        }],
        endpoint: { type: mongoose.Schema.Types.ObjectId, ref: 'Endpoint' },
    },
    { timestamps: true },
);

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = {
    Organization,
};
