const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { humanNameSchema } = require('./humanName');
const { identifierSchema } = require('./identifier');
const { validator } = require('../misc/reqDataValidator');

const practitionerSchema = new mongoose.Schema(
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
        name: [humanNameSchema], // The name(s) associated with the practitioner
        telecom: [contactPointSchema], // // A contact detail for the practitioner (that apply to all roles)
        address: [addressSchema], // Address(es) of the practitioner that are not role specific (typically home address)
        gender: {
            type: String,
            enum: ['female', 'male', 'other', 'unkown'],
        },
        birthDate: {
            type: Date,
        },
        photo: [{ type: String }],
        qualification: [{ // Certification, licenses, or training pertaining to the provision of care
            identifier: [identifierSchema], // // An identifier for this qualification for the practitioner
            code: codeableConceptSchema, //  Coded representation of the qualification
            period: { // Period during which the qualification is valid
                start: { type: Date },
                end: { type: Date },
            },
            issuer: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // Organization that regulates and issues the qualification
        }],
        communication: [codeableConceptSchema], // A language the practitioner can use in patient communication
    },
    { timestamps: true },
);

practitionerSchema.methods.validPassword = async function verifyPassword(password) {
    const res = await bcrypt.compare(password, this.password);
    return res;
};

const Practitioner = mongoose.model('Practitioner', practitionerSchema);

const practitionerSchemaAjv = {
    $id: 'practitionerSchema',
    title: 'practitioner',
    description: 'practitioner data',
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

function validateRegistration(practitioner) {
    return validator(practitioner, practitionerSchemaAjv, []);
}

module.exports = {
    Practitioner,
    validateRegistration,
};
