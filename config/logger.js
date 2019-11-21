const winston = require('winston');
const config = require('../config');

// Format output when running tests
const logTestFormat = winston.format.printf(info => `${info.level} [${info.label}]: ${info.message}`);

// Format output when in dev mode
const logDevFormat = winston.format.printf(info => {
  let { level, label } = info;
  const {
    pathDepth, message, timestamp, ms
  } = info;
  label = info.label.padStart(27);
  level = info.level.padStart(15);
  return `${timestamp} ${level} [${pathDepth}] [${label}]: ${message} [${ms}]`;
});
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
          // winston.format.metadata({ test: 'Hello' }),
          winston.format.colorize({ all: true }),
          // winston.format.padLevels(),
          winston.format.align(),
          winston.format.timestamp({
            format: 'HH:mm:ss'
          }),
          winston.format.ms(),
          logDevFormat
        ),
        exitOnError: false
      })
    );
    break;
  default:
    transports.push(new winston.transports.Console());
    break;
}

const addLogger = (filename, pathDepth) => {
  // Create label
  const filenameArray = filename.split('\\');
  const filenameLength = filenameArray.length;
  let label = `${filenameArray[filenameLength - 2]}/${
    filenameArray[filenameLength - 1]
  }`;
  // eslint-disable-next-line prefer-destructuring
  label = label.split('.')[0];

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
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      // winston.format.prettyPrint(),
      winston.format.metadata({
        fillExcept: [
          'message',
          'level',
          'timestamp',
          'label',
          'pathDepth'
        ]
      })
    ),
    defaultMeta: { pathDepth },
    exitOnError: false,
    transports
  });
  const logger = winston.loggers.get(label);
  logger.silly(`New logger with label ${label} created`);
  return logger;
};

module.exports = { addLogger };
