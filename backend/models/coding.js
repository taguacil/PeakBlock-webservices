const mongoose = require('mongoose');

const codingSchema = new mongoose.Schema(
    {
        system: {
            type: String,
            validator: function isURIValid(v) {
                return /\w+:(\/?\/?)[^\s]+/.test(v);
            },
            message: (props) => `${props.value} is not a valid uri.`,
        },
        version: {
            type: String,
        },
        code: {
            type: String,
        },
        display: {
            type: String,
        },
        userSelected: {
            type: Boolean,
        },
    },
);


module.exports = { codingSchema };
