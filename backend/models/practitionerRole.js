const mongoose = require('mongoose');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { identifierSchema } = require('./identifier');

const practitionerRoleSchema = new mongoose.Schema(
    {
        identifier: [identifierSchema], // Business Identifiers that are specific to a role/location
        active: {
            type: Boolean,
        },
        period: { // The period during which the practitioner is authorized to perform in these role(s)
            start: { type: Date },
            end: { type: Date },
        },
        practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'Practitioner' }, // Practitioner that is able to provide the defined services for the organization
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // Organization where the roles are available
        code: [codeableConceptSchema], // Roles which this practitioner may perform
        specialty: [codeableConceptSchema],
        location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
        healthcareService: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthcareService' },
        telecom: [contactPointSchema], // Contact details that are specific to the role/location/service
        availableTime: [{ // Times the Service Site is available
            daysOfWeek: {
                type: String,
                enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            },
            allDay: { type: Boolean }, // Always available? e.g. 24 hour service
            availableStartTime: Date, // Opening time of day (ignored if allDay = true)
            availableEndTime: Date, // Closing time of day (ignored if allDay = true)
        }],
        notAvailable: [{ // Not available during this time due to provided reason
            description: {
                type: String,
            }, // R!  Reason presented to the user explaining why time not available
            during: { // Service not available from this date
                start: { type: Date },
                end: { type: Date },
            },
        }],
        availabilityExceptions: String, // Description of availability exceptions
    },
    { timestamps: true },
);

const PractitionerRole = mongoose.model('PractitionerRole', practitionerRoleSchema);

module.exports = {
    PractitionerRole,
};
