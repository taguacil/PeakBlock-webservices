const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { humanNameSchema } = require('./humanName');
const { validator } = require('../misc/reqDataValidator');

const organizationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            minlength: 5,
            maxlength: 255,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            minlength: 8,
            maxlength: 1024,
            required: true,
        },
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
    },
    { timestamps: true },
);

organizationSchema.methods.validPassword = async function verifyPassword(password) {
    const res = await bcrypt.compare(password, this.password);
    return res;
};

const Organization = mongoose.model('Organization', organizationSchema);

const organizationSchemaAjv = {
    $id: 'organizationSchema',
    title: 'organization',
    description: 'organization data',
    type: 'object',
    required: [
        'name',
        'email',
        'password',
    ],
    properties: {
        name: {
            type: 'string',
        },
        email: {
            type: 'string',
            format: 'email',
            minLength: 5,
            maxLength: 255,
        },
        password: {
            type: 'string',
            minLength: 8,
            maxLength: 1024,
        },
    },
};

function validateRegistration(organization) {
    return validator(organization, organizationSchemaAjv, []);
}

module.exports = {
    Organization,
    validateRegistration,
};
