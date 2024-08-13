const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD',
    level: env === 'production' ? 'info' : 'debug'
});

const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} | ${info.level} | ${info.message}`)
    ),
    transports: [
        new transports.Console({
            level: env === 'production' ? 'info' : 'debug',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} | ${info.level} | ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
});

function changeToDebugLevel() {
    logger.transports.forEach(transport => transport.level = 'debug');
}

function changeToProdLevel() {
    logger.transports.forEach(transport => transport.level = 'info');
}
  
module.exports = {
    logger,
    changeToDebugLevel,
    changeToProdLevel
}