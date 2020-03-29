const winston = require('winston');
const fs = require('fs');
const { ForbiddenError } = require('@casl/ability');

// eslint-disable-next-line no-unused-vars
module.exports = function logError(err, req, res, next) {
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            fs.unlinkSync(req.files[i].path);
        }
    }

    winston.error(err.message, err);

    if (err instanceof ForbiddenError) {
        return res.status(403).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
};
