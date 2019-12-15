/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */

// path
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
 * If label for Logger.mainLogger is not provided then sets label as 'main.
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
  label = label.padStart(23); // timestamp, level.verbose and requestID are 23 chars long
  level = level.padStart(17); // timestamp, level.verbose are 17 chars long
  requestId = requestId.toString().padStart(3, '0'); // adds zeros in front of number
  let msg = `${timestamp} ${level} [${requestId}] [${label}]: ${message} [${ms}] in ${short} [${line}:${column}]`;
  // console.log(stripAnsi(msg).length + 4, process.stdout.columns);
  // msg = (stripAnsi(msg).length + 4 > process.stdout.columns) ? `${msg}\n` : msg;
  return msg;
});

/**
 * Sets label, requestId and deletes new line in message if label is http.
 *
 * The application is using morgan with winston. The morgan logger adds new line at the end
 * of message.
 *
 * Adds new properties from trace object to info object: line, column and short.
 * @private
 * @memberof module:config/LoggerClass
 * @function specialFormat
 * @param {object} info
 * @returns {object} Winston info object.
 */
const specialFormat = format(info => {
  let label = info.label || info.metadata.label;
  let requestId = info.requestId || info.metadata.requestId;
  info.label = !label ? 'main' : label;
  info.requestId = !requestId ? 0 : requestId;

  // Gets trace object and sets line, column and short info properties.
  let { stack, trace } = getTrace();
  info.line = !info.line ? trace.line : info.line;
  info.column = !info.column ? trace.column : info.column;
  info.short = !info.short ? trace.short : info.short;

  // Removes ANSI code in string
  const http = stripAnsi(info.message.substring(0, info.message.indexOf(' ')));
  // Checks if message is from morgan logger. If true, sets label to 'http'.
  if (HTTP.includes(http)) {
    info.label = 'http';
    info.message = info.message.replace(/\n/g, '');
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
      fillExcept: ['message', 'level', 'ms', 'timestamp'],
      fillwith: ['label', 'requestId']
    }),
    specialFormat()
  ),
  defaultMeta: { service: 'user-service' },
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
 * At the moment only console transport.
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
 * @example Example
 * const LoggerClass = require('./config/LoggerClass');
 *
 * const Logger = new LoggerClass();
 * const { mainLogger, logger } = Logger;
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
