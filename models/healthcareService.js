const mongoose = require('mongoose');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { identifierSchema } = require('./identifier');

const healthcareServiceSchema = new mongoose.Schema(
    {
        identifier: [identifierSchema], // External identifiers for this item
        active: {
            type: Boolean,
        }, // Whether this HealthcareService record is in active use
        providedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // Organization that provides this service
        category: [codeableConceptSchema], // Broad category of service being performed or delivered
        type: [codeableConceptSchema], // Type of service that may be delivered or performed
        specialty: [codeableConceptSchema], // Specialties handled by the HealthcareService
        location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }], // Location(s) where service may be provided
        name: {
            type: String,
        }, // Description of service as presented to a consumer while searching
        comment: {
            type: String,
        }, // Additional description and/or any specific issues not covered elsewhere
        extraDetails: {
            type: String,
        }, // Extra details about the service that can't be placed in the other fields
        photo: { type: String }, // Facilitates quick identification of the service
        telecom: [contactPointSchema], // Contacts related to the healthcare service
        coverageArea: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }], // Location(s) service is intended for/available to
        serviceProvisionCode: [codeableConceptSchema], // Conditions under which service is available/offered
        eligibility: [{ // Specific eligibility requirements required to use the service
            code: codeableConceptSchema, // Coded value for the eligibility
            comment: String, // Describes the eligibility conditions for the service
        }],
        program: [codeableConceptSchema], // Programs that this service is applicable to
        characteristic: [codeableConceptSchema], // Collection of characteristics (attributes)
        communication: [codeableConceptSchema], // The language that this service is offered in
        referralMethod: [codeableConceptSchema], // Ways that the service accepts referrals
        appointmentRequired: Boolean, // If an appointment is required for access to this service
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

const HealthcareService = mongoose.model('HealthcareService', healthcareServiceSchema);

module.exports = {
    HealthcareService,
};
