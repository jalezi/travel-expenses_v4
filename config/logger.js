const winston = require('winston');
const config = require('../config');

const logFormat = winston.format.printf(
  info => {
    const { pathDepth } = info;
    const label = info.label.padStart(27);
    const level = info.level.padStart(15);
    return `${info.timestamp} ${level} [${pathDepth}] [${label}]: ${info.message}`;
  }
);
// TODO Add error handler and files transports
const transports = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.align(),
        winston.format.timestamp({
          format: 'HH:mm:ss'
        }),
        logFormat
      ),
      exitOnError: false
    })
  );
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
  // Set metadata
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
      winston.format.prettyPrint(),
      winston.format.metadata({
        fillExcept: ['message', 'level', 'timestamp', 'label', 'pathDepth', 'trace']
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
