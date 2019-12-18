/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
const path = require('path');
const { createLogger, config, transports, format } = require('winston');
const stripAnsi = require('strip-ansi');

const { envNode, logs } = require('../config');
const { HTTP } = require('../lib/constants');
const getTrace = require('../utils/getTrace');

/**
 * @memberof module:config/LoggerClass
 * @alias loggerTraceObject
 * @typedef {object} loggerTraceObject Some information about files.
 * @property {stackTraceObject} trace Trace information.
 * @property {string} mainModule Main application module.
 * @property {string} callerPath Full parent module caller name - path.
 * @property {string} callerName Short parent module caller name.
 * @property {string} filepath Full filename - path.
 * @property {string} filename Short filename.
 */

/**
 * Creates logger trace object. You can access with {Logger.traceObject}.
 * @private
 * @memberof module:config/LoggerClass
 * @function stackTrace
 * @returns {loggerTraceObject} With 6 properties: traceObject, main module, callerModule,
 * filepath and filename
 */
const stackTrace = () => {
  const trace = getTrace();
  const mainModule = path.basename(process.mainModule.filename);
  const callerSplit = module.parent.filename.split('\\');
  const callerName = callerSplit[callerSplit.length - 1];
  const filenameSplit = __filename.split('\\');
  const filename = filenameSplit[filenameSplit.length - 1];
  const data = {
    trace,
    mainModule,
    callerPath: module.parent.filename,
    callerName,
    filepath: __filename,
    filename
  };
  return data;
};

/**
 * Winston format.printf function for test mode.
 * If label is not provided then sets label as filename.
 * @private
 * @memberof module:config/LoggerClass
 * @function logTestFormat
 * @param {object} info Winston info object.
 * @returns {string} Formated logger output.
 */
const logTestFormat = format.printf(info => {
  let { level, label, message, ms } = info;
  return `${level} ${label} ${message} ${ms}`;
});

/**
 * Winston format.printf function for development mode.
 * If label for Logger.mainLogger is not provided then sets label as 'main'.
 * @private
 * @memberof module:config/LoggerClass
 * @function logDevFormat
 * @param {object} info Winston info object.
 * @returns {string} Formated logger output.
 */
const logDevFormat = format.printf(info => {
  let { level, message, timestamp, ms } = info;
  let { label, requestId } = info;
  let { line, column, short } = info;
  let { dataMessage, stackMessage } = info;
  label = label.padStart(23); // timestamp, level.verbose and requestID are 23 chars long
  level = level.padStart(17); // timestamp, level.verbose are 17 chars long
  requestId = requestId.toString().padStart(3, '0'); // adds zeros in front of number

  let msg = '';
  // include data message
  if (dataMessage) {
    msg = `${timestamp} ${level} [${requestId}] [${label}]: ${message} ${dataMessage} [${ms}] in \\${short}:${line}:${column}\n`;
  } else {
    msg = `${timestamp} ${level} [${requestId}] [${label}]: ${message} [${ms}] in \\${short}:${line}:${column}`;
  }

  // include stack message
  if (info.stackTrace) {
    msg += stackMessage;
  }

  return msg;
});

/**
 * Sets label, requestId and deletes new line in message if label is http.
 *
 * The application is using morgan with winston. The morgan logger adds new line at the end
 * of message.
 *
 * Adds new properties from trace object to info object: line, column and short.
 * If object is passed as first argument instead of string then converts object to message.
 * @private
 * @memberof module:config/LoggerClass
 * @function specialFormat
 * @param {object} info
 * @returns {object} Winston info object.
 */
const specialFormat = format(info => {
  let { metadata } = info;
  let label = info.label || info.metadata.label;
  let requestId = info.requestId || info.metadata.requestId;
  info.label = !label ? 'main' : label;
  info.requestId = !requestId ? 0 : requestId;

  // Gets trace object and sets line, column and short info properties.
  let { stack, trace } = getTrace();
  info.stack = stack;
  info.line = !info.line ? trace.line : info.line;
  info.column = !info.column ? trace.column : info.column;
  info.short = !info.short ? trace.short : info.short;

  // Checks if message comes from morgan logger, sets label and removes newline from message
  let http;
  try {
    // Removes ANSI code in string
    http = stripAnsi(info.message.substring(0, info.message.indexOf(' ')));
    // Checks if message is from morgan logger. If true, sets label to 'http'.
    if (HTTP.includes(http)) {
      info.label = 'http';
      info.message = info.message.replace(/\n/g, '');
    }
  } catch (error) {
    http = '';
    // Message is not string but object.
    // Create metadata properties, prepare message and dataMessage.
    Object.keys(info.message).forEach(key => {
      info.metadata[key] = info.message[key];
    });
    info.message = 'Data:';
    info.dataMessage = '\n';
  }

  // Check for specific metadata and add special message to dataMessage.
  if (info.metadata.user) {
    let { user } = info.metadata;
    info.dataMessage += `\t\tuser: ${user._id}`;
  }

  if (info.metadata.travel) {
    let { travel } = info.metadata;
    info.dataMessage += `\t\ttravel: ${travel._id}, user: ${travel._user}`;
  }

  if (info.metadata.expense) {
    let { expense } = info.metadata;
    info.dataMessage += `\t\texpense: ${expense._id}, travel: ${expense.travel}`;
  }

  if (info.metadata.currency) {
    let { currency } = info.metadata;
    let rateKey = Object.keys(currency.rate)[0];
    info.dataMessage += `\t\tcurrency: ${rateKey}, rate: ${currency.rate[rateKey]}, base: ${currency.base}, date: ${currency.date}`;
  }

  // Create stackMessage - loop through trace stack.
  info.stackMessage = '\n\tTrace:\n';
  for (let index = 0; index < stack.length; index++) {
    const element = stack[index];
    let { func, method, line } = element;
    let { column, type, short } = element;
    let stackMessage = `\t\tat ${func} in \\${short}:${line}:${column}, method: ${method}, type: ${type}\n`;
    stackMessage = stripAnsi(stackMessage);
    info.stackMessage += stackMessage;
  }

  return info;
});

/**
 * Winston transports.
 * Different tranports for test, development & production mode.
 * @private
 * @memberof module:config/LoggerClass
 * @type {transports[]}
 */
const wTransports = [];

/**
 * Winton Console transport.
 * @private
 * @memberof module:config/LoggerClass
 * @type {transports.Console}
 */
let consoleTransport;
// Set console depend on environment mode
switch (process.env.NODE_ENV) {
  case (envNode.match(/^test/) || {}).input:
    consoleTransport = new transports.Console({
      format: format.combine(logTestFormat)
    });
    break;
  case 'development':
    consoleTransport = new transports.Console({
      format: format.combine(
        format.align(),
        format.colorize({ all: true }),
        format.metadata({
          fillWith: ['currency', 'travel', 'expense', 'user']
        }),
        logDevFormat
      )
    });
    break;
  default:
    consoleTransport = new transports.Console({ format: format.simple() });
}
wTransports.push(consoleTransport);

/**
 * It's winston logger created with  winston createLogger() function.
 * @private
 * @memberof module:config/LoggerClass
 * @constant logger Winston logger
 *
 */
const logger = createLogger({
  level: envNode === 'development' ? logs.level : 'info',
  levels: config.npm.levels,
  format: format.combine(
    format.errors({ stack: true }),
    format.json(),
    format.splat(),
    format.simple(),
    format.timestamp({ format: 'HH:mm:ss' }),
    format.ms(),
    format.metadata({
      fillExcept: [
        'message',
        'level',
        'ms',
        'timestamp',
        'service',
        'stackTrace'
      ],
      fillwith: ['label', 'requestId']
    }),
    specialFormat()
  ),
  defaultMeta: { service: 'user-service', stackTrace: logs.trace },
  transports: wTransports,
  exitOnError: false
});

/**
 * @private
 * @description This is used by morgan logger.
 * @memberof module:config/LoggerClass
 * @type {object}
 * @property {function} write
 */
const stream = {
  // eslint-disable-next-line no-unused-vars
  write: (message, encoding) => {
    // use the 'info' log level so the output will be picked up by transports
    logger.info(message);
  }
};

/**
 * @memberof module:config/LoggerClass
 * @alias Logger
 * @class
 * @classdesc Uses predefined {@link module:config/LoggerClass.logger winston logger}.
 * Created logger uses specificFormat.
 * Logger has at the moment only one transport - Console.
 * Console transport depends on environment mode uses logDevFormat or logTestFormat.
 * @see {@link module:config/LoggerClass.logger winston logger}
 * @see {@link https://www.npmjs.com/package/winston NPM:winston}
 *
 * @constructor
 * @param {string} [label='child']  Default child logger label. Default value: 'child'.
 * @param {number} [requestId=999]      To be defined. Default value: 0.
 * @property mainLogger Winston logger
 * @property logger Winston child logger
 * @property {loggerTraceObject} traceObject Files informations
 * @property {number} count Number of class instances
 * @example Example 1
 * const LoggerClass = require('./config/LoggerClass');
 *
 * const Logger = new LoggerClass();
 * const { mainLogger, logger } = Logger;
 *
 * mainLogger.info('This is main logger info message');
 * // returns 13:45:12 [info] [000] [main] This is info message in \config\LoggerClass:294:14
 *
 * logger.info('This is child logger info message');
 * // returns 13:45:12 [info] [999] [child] This is info message in \config\LoggerClass:296:11
 *
 * @example Example 2
 * const LoggerClass = require('./config/LoggerClass');
 *
 * const Logger = new LoggerClass('myLabel');
 * const { mainLogger, logger } = Logger;
 *
 * mainLogger.info('This is main logger info message');
 * // returns 13:45:12 [info] [000] [main] This is info message in \config\LoggerClass:304:14
 *
 * mainLogger.info('This is main logger info message', { label: 'new Label'});
 * // returns 13:45:12 [info] [000] [new Label] This is info message in \config\LoggerClass:304:14
 *
 * logger.info('This is child logger info message');
 * // returns 13:45:12 [info] [999] [myLabel] This is info message in \config\LoggerClass:306:11
 *
 * logger.info('This is child logger info message', { label: 'new Label'});
 * // returns 13:45:12 [info] [999] [new Label] This is info message in \config\LoggerClass:306:11
 *
 * @todo Define param requestId description
 *
 */
class Logger {
  constructor(label = 'child', requestId = 999) {
    this._traceObject = stackTrace();
    Object.freeze(this._traceObject);
    this._label = label;
    this._requestId = requestId;
    this.__logger = logger;
    this.__logger.stream = stream;
    this._logger = this.__logger.child({
      label: `${this._label}`,
      requestId: this._requestId
    });
    this._logger.stream = stream;
    this._childLoggers = [];
    Logger._count++;
  }

  /**
   * This is {@link module:config/LoggerClass.logger winston logger}.
   * @readonly
   * @returns Winston logger.
   */
  get mainLogger() {
    return this.__logger;
  }

  /**
   * This is winston child logger created in the constructor.
   * @readonly
   * @returns mainLogger's child - Winston child logger.
   */
  get logger() {
    return this._logger;
  }

  /**
   * Information about files.
   * @readonly
   * @returns {object} Some information about files.
   */
  get traceObject() {
    return this._traceObject;
  }

  /**
   * This is number of Logger instances.
   * @readonly
   * @static
   * @returns {number} Number of class instances.
   */
  static get count() {
    return Logger._count;
  }
}

Logger._count = 0;

/**
 * @fileoverview This is logger class.
 *
 * @module config/LoggerClass
 * @author Jaka Daneu
 * @requires NPM:path
 * @requires NPM:winston
 * @requires module:config
 * @requires module:lib/constans
 * @requires module:utils/getTrace
 * @see {@link https://www.npmjs.com/package/path NPM:path}
 * @see {@link https://www.npmjs.com/package/winston NPM:winston}
 */

/**
 * Logger Class
 * @type {Logger}
 */
module.exports = Logger;
