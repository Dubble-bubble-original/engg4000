const winston = require('winston');

let customFormat = winston.format.combine(
    winston.format.colorize({
        all: true
    }),
);

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [ new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(),customFormat) }) ]
});

module.exports = logger;