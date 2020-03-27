const crypto = require('crypto');
const bcrypt = require("bcrypt");
const _ = require("lodash");
var emailvalidator = require("email-validator");
const { User, validate } = require("../models/user");

// GET.
exports.get = async (req, res) => {
    const users = await User.find({});
    res.send(users);
};

// User Registration.
exports.register = async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const valid = emailvalidator.validate(req.body.email);
    if (!valid) return res.status(400).send('Invalid Email!');

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email already registered.");

    user = await User.findOne({ phone: req.body.phone });
    if (user) return res.status(400).send("Phone Number already registered.");

    user = new User(
        _.pick(req.body, [
        "name",
        "email",
        "password",
        "phone",
        "gender",
        "dob"
        ])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const userObj = new User(user);
    await userObj.save();

    res.send(_.pick(user, ["_id", "name", "email", "phone"]));
};
