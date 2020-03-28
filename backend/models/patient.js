const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { humanNameSchema } = require('./humanName');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { codeableConceptSchema } = require('./codeableConcept');
const { validator } = require('../misc/reqDataValidator');

const patientSchema = new mongoose.Schema({
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
    active: { // Whether this patient record is in active use
        type: Boolean,
        required: true,
        default: true,
    },
    name: humanNameSchema,
    telecom: [contactPointSchema],
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'unknown'],
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    deceased: {
        type: Date, // if undefined, then not dead yet
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
    communication: [{
        langauge: codeableConceptSchema,
        preferred: {
            type: Boolean,
        },
    }],
    generalPractitioner: [{
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
    covid_state: {
        type: String,
        enum: ['certain', 'probable', 'possible', 'certainly_not'],
    },
    excorona: {
        type: Boolean,
    },
}, { timestamps: true });

patientSchema.methods.validPassword = async function verifyPassword(password) {
    const res = await bcrypt.compare(password, this.password);
    return res;
};

const Patient = mongoose.model('Patient', patientSchema);

const patientSchemaAjv = {
    $id: 'patientSchema',
    title: 'Patient',
    description: 'patient data',
    type: 'object',
    required: [
        'name',
        'email',
        'password',
        'birthDate',
        'gender',
    ],
    properties: {
        name: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                },
            },
            required: [
                'text',
            ],
            additionalProperties: false,
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
        gender: {
            type: 'string',
            enum: [
                'male',
                'female',
                'other',
                'unknown'
            ],
        },
        birthDate: {
            type: 'string',
            format: 'date',
        },
    },
};

const symptomsAjv = {
    title: 'Symptoms',
    description: 'symptoms data',
    type: 'object',
    required: [
        'observations',
        'excorona'
    ],
    properties: {
        observations: {
            type: 'object',
            properties: {
                bodyTemperature: {
                    type: 'number',
                    minumum: 35,
                    maximum: 45,
                },
                cough: {
                    type: 'boolean',
                },
                fatigue: {
                    type: 'boolean',
                },
                pain_in_throat: {
                    type: 'boolean',
                },
                dyspnea_at_rest: {
                    type: 'boolean',
                },
                headache: {
                    type: 'boolean',
                },
                diarrhea: {
                    type: 'boolean',
                },
                nausea: {
                    type: 'boolean',
                },
                loss_of_sense_of_smell: {
                    type: 'boolean',
                },
            },
            required: [
                'bodyTemperature', 'cough', 'fatigue', 'pain_in_throat', 'dyspnea_at_rest', 'headache', 'diarrhea', 'nausea', 'loss_of_sense_of_smell',
            ],
            additionalProperties: false,
        },
        medical_conditions: {
            type: 'array',
            items: {
                type: 'string',
                minlength: 2,
            },
        },
        excorona: {
            type: 'boolean',
        },
    },
};

function validatePatient(patient) {
    return validator(patient, patientSchemaAjv, []);
}

function validateSymptoms(symptoms) {
    return validator(symptoms, symptomsAjv, []);
}


module.exports = {
    Patient,
    validate: validatePatient,
    validateSymptoms,
};
