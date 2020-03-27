const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validator } = require('../misc/reqDataValidator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true,
    },
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
    phone: {
        type: String,
        unique: true,
        validate: {
            validator: function isPhoneNumberValid(v) {
                return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number.`,
        },
        required: [true, 'phone number is required.'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
    },
    dob: {
        type: Date,
        required: true,
        max: '2003-01-01', // 16 years old and above - "YYYY-MM-DD"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number], // X for lon, Y for lat
        },
    },
}, { timestamps: true });

userSchema.methods.validPassword = async function verifyPassword(password) {
    const res = await bcrypt.compare(password, this.password);
    return res;
};

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

const userSchemaAjv = {
    $id: 'userSchema',
    title: 'User',
    description: 'User data',
    type: 'object',
    required: [
        'name',
        'password',
        'dob',
        'gender',
    ],
    properties: {
        name: {
            type: 'string',
            minLength: 5,
            maxLength: 50,
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
        phone: {
            type: 'string',
            pattern: '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$',
        },
        gender: {
            type: 'string',
            enum: [
                'Male',
                'Female',
            ],
        },
        dob: {
            type: 'string',
            format: 'date',
        },
    },
};

function validateUser(user) {
    return validator(user, userSchemaAjv, []);
}

module.exports = {
    User,
    validate: validateUser,
};
