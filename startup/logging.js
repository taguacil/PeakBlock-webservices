require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  winston.configure({
    transports: [
      new winston.transports.File({
        filename: "logfile.log"
      }),
      new winston.transports.File({
        filename: "uncaughtExceptions.log",
        handleExceptions: true
      }),
      new winston.transports.Console({
        colorize: true,
        prettyPrint: true,
        handleExceptions: true
      }),
      new winston.transports.MongoDB({
        db: "mongodb://localhost/PeakBlock",
        level: "info"
      })
    ],
    exitOnError: false
  });
};

process.on("unhandledRejection", ex => {
  console.log("logging exception : ", ex);
  throw ex;
});
