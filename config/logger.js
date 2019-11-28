/* eslint-disable object-curly-newline */
const winston = require('winston');
const config = require('../config');

const deleteNewLine = (label, message) => {
  if (label === 'http') {
    message = message.replace(/\n/g, '');
  }
  return message;
};

// Format output when running tests
const logTestFormat = winston.format.printf(info => {
  let { level, label, message, ms } = info;
  message = deleteNewLine(label, message);
  return `${level} ${label} ${message} ${ms}`;
});

// Format output when in dev mode
const logDevFormat = winston.format.printf(info => {
  let { level, label, message } = info;
  const { pathDepth, timestamp, ms } = info;
  message = deleteNewLine(label, message);
  label = info.label.padStart(27);
  level = info.level.padStart(15);
  return `${timestamp} ${level} [${pathDepth}] [${label}]: ${message} [${ms}]`;
});

// Create logger transports based on NODE_ENV
// TODO Add error handler and files transports
const transports = [];

switch (process.env.NODE_ENV) {
  case 'test':
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.align(),
          winston.format.padLevels(),
          winston.format.ms(),
          logTestFormat
        ),
        exitOnError: false
      })
    );
    break;
  case 'development':
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.align(),
          winston.format.timestamp({ format: 'HH:mm:ss' }),
          winston.format.ms(),
          logDevFormat
        ),
        exitOnError: false
      })
    );
    break;
  default:
    transports.push(
      new winston.transports.Console({
        format: winston.format.simple()
      })
    );
    break;
}

const addLogger = (filename, pathDepth) => {
  let label;

  // Extract label from filename
  const filenameArray = filename.split('\\');
  const filenameArrayLength = filenameArray.length;

  if (filenameArrayLength > 1) {
    label = `${filenameArray[filenameArrayLength - 2]}/${
      filenameArray[filenameArrayLength - 1]
    }`;
  } else {
    label = `${filenameArray[filenameArrayLength - 1]}`;
  }

  // eslint-disable-next-line prefer-destructuring
  label = label.split('.')[0];

  // Check if pathDepth is provided
  if (!pathDepth) {
    pathDepth = 0;
  }

  // Check if logger with label is already in winston.Container
  if (winston.loggers.has(label)) {
    return winston.loggers.get(label);
  }

  // Add logger
  winston.loggers.add(label, {
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.label({ label }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      winston.format.metadata({
        fillExcept: ['message', 'level', 'timestamp', 'label', 'pathDepth']
      })
    ),
    defaultMeta: { pathDepth },
    exitOnError: false,
    transports
  });
  const logger = winston.loggers.get(label);
  // create a stream object with a 'write' function that will be used by `morgan`
  logger.stream = {
    // eslint-disable-next-line no-unused-vars
    write: (message, encoding) => {
      // use the 'info' log level so the output will be picked up by transports
      logger.info(message);
    }
  };
  logger.silly(`New logger with label ${label} created`);
  return logger;
};

module.exports = { addLogger };
