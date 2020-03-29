const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { codeableConceptSchema } = require('./codeableConcept');
const { contactPointSchema } = require('./contactPoint');
const { addressSchema } = require('./address');
const { humanNameSchema } = require('./humanName');

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

module.exports = {
    Organization,
};
