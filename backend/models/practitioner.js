const mongoose = require('mongoose');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { humanNameSchema } = require('./humanName');
const { identifierSchema } = require('./identifier');

const practitionerSchema = new mongoose.Schema(
    {
        identifier: [identifierSchema], // An identifier for the person as this agent
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

const Practitioner = mongoose.model('Practitioner', practitionerSchema);

module.exports = {
    Practitioner,
};
