const mongoose = require('mongoose');
const { humanNameSchema } = require('./humanName');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { codeableConceptSchema } = require('./codeableConcept');

const patientSchema = new mongoose.Schema({
    active: { // Whether this patient record is in active use
        type: Boolean,
        required: true,
    },
    name: humanNameSchema,
    telecom: [contactPointSchema],
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'unknown'],
    },
    birthDate: {
        type: Date,
    },
    deceasedBoolean: {
        type: Boolean,
    },
    deceasedDatetime: {
        type: Date,
    },
    address: [addressSchema],
    maritalStatus: codeableConceptSchema,
    mutlipleBirthBoolean: { // Indicates whether the patient is part of a multiple (boolean) or indicates the actual birth order (integer).
        type: Boolean,
    },
    mutlipleBirthInteger: { // Indicates whether the patient is part of a multiple (boolean) or indicates the actual birth order (integer).
        type: Number,
    },
    photo: [{
        type: String,
    }],
    contact: [{
        relationship: [codeableConceptSchema],
        name: humanNameSchema,
        telecom: [contactPointSchema],
        address: addressSchema,
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'unknown'],
        },
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        period: {
            start: { type: Date },
            end: { type: Date },
        },
    }],
    communcation: [{
        langauge: codeableConceptSchema,
        preferred: {
            type: Boolean,
        },
    }],
    generalPractioner: [{
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'Practitioner' },
        practitionerRole: { type: mongoose.Schema.Types.ObjectId, ref: 'PractitionerRole' },
        // [{ Reference(Organization|Practitioner|PractitionerRole) }], // Patient's nominated primary care provider
    }],
    managingOrganization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    link: [{ // Link to another patient resource that concerns the same actual person
        other: { // TODO: { Reference(Patient|RelatedPerson) }, // R!  The other patient or related person resource that the link refers to
            patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
            // TODO: relatedPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'RelatedPerson' },
        },
        type: {
            type: String,
            enum: ['replaced-by', 'replaces', 'refer', 'seealso'],
        },
    }],
    observations: {
        bodyTemperature: {
            type: Number,
        },
        cough: {
            type: Boolean,
        },
        fatigue: {
            type: Boolean,
        },
        pain_in_throat: {
            type: Boolean,
        },
        dyspnea_at_rest: {
            type: Boolean,
        },
        headache: {
            type: Boolean,
        },
        diarrhea: {
            type: Boolean,
        },
        nausea: {
            type: Boolean,
        },
        loss_of_sense_of_smell: {
            type: Boolean,
        },
    },
    medical_conditions: [{ // diabetes, heart disease, allergies,..
        type: String,
    }],
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {
    Patient,
};
