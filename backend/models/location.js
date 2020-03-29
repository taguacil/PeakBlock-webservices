const mongoose = require('mongoose');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { identifierSchema } = require('./identifier');
const { codingSchema } = require('./coding');

const locationSchema = new mongoose.Schema(
    {
        identifier: [identifierSchema], // Unique code or number identifying the location to its users
        status: {
            type: String,
            enum: ['active', 'suspended', 'inactive'],
        },
        operationalStatus: codingSchema, // The operational status of the location (typically only for a bed/room)
        name: String, // Name of the location as used by humans
        alias: [{ type: String }], // A list of alternate names that the location is known as, or was known as, in the past
        description: String, // Additional details about the location that could be displayed as further information to identify the location beyond its name
        mode: {
            type: String,
            enum: ['instance', 'kind'],
        },
        type: [codeableConceptSchema], // Type of function performed
        telecom: [contactPointSchema], // Contact details of the location
        address: addressSchema, // Physical location
        physicalType: codeableConceptSchema, // Physical form of the location
        position: { // The absolute geographic location
            longitude: Number, // R!  Longitude with WGS84 datum
            latitude: Number, // R!  Latitude with WGS84 datum
            altitude: Number, // Altitude with WGS84 datum
        },
        managingOrganization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // Organization responsible for provisioning and upkeep
        partOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, // Another Location this one is physically a part of
        hoursOfOperation: [{ // What days/times during a week is this location usually open
            daysOfWeek: {
                type: String,
                enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            },
            allDay: { type: Boolean }, // The Location is open all day
            openingTime: Date, // Time that the Location opens
            closingTime: Date, // Time that the Location closes
        }],
        availabilityExceptions: String, // Description of availability exceptions
    },
    { timestamps: true },
);

const Location = mongoose.model('Location', locationSchema);

module.exports = {
    Location,
};
