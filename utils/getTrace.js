/* eslint-disable no-continue */
const assert = require('assert');
const stackTrace = require('stack-trace');
const appRoot = require('app-root-path');

/**
 * This is basic trace information about caller.
 * @memberof module:utils/getTrace
 * @alias traceObject
 * @typedef {object} traceObject
 * @property {string} file
 * @property {string} func
 * @property {string} method
 * @property {number} line
 * @property {number} column
 * @property {string} type
 * @property {string} short
 */

/**
 * This is full trace information until internal modules are called.
 * @memberof module:utils/getTrace
 * @alias stackTraceObject
 * @typedef {object} stackTraceObject
 * @property {traceObject[]} stack
 * @property {number} length Stack array length.
 * @property {traceObject} trace Last element from stack.
 */


// TODO skip getTrace and LoggerClass stack
/**
 * Creates trace information until internal modules.
 * @memberof module:utils/getTrace
 * @alias getTrace
 * @function getTrace
 * @returns {stackTraceObject} Object with 3 properties.
 */
const getTrace = () => {
  const trace = stackTrace.get();
  const dirname = appRoot.resolve('');
  assert.strictEqual(trace[0].getFileName(), __filename);
  let newTrace = { stack: [], length: 0, trace: {} };
  for (let index = 0; index < trace.length; index++) {
    let element = trace[index];
    let file = element.getFileName();
    file = !file ? 'unknown' : file;
    const func = element.getFunctionName();
    const method = element.getMethodName();
    const line = element.getLineNumber();
    const column = element.getColumnNumber();
    const type = element.getTypeName();
    const short = file.replace(`${dirname}\\`, '');
    if (file.includes('node_modules')) {
      continue;
    }
    if (file.startsWith(dirname)) {
      newTrace.trace = {
        file,
        func,
        method,
        line,
        column,
        type,
        short
      };
      newTrace.stack.push(newTrace.trace);
      continue;
    }
    // console.log(index, newTrace.trace.file);
    newTrace.length = newTrace.stack.length;
    return newTrace;
  }
};

/**
 * @fileoverview Exports getTrace method.
 * @module utils/getTrace
 * @author Jaka Daneu
 * @requires NPM:assert
 * @requires NPM:stack-trace
 * @requires NPM:path
 * @see {@link https://www.npmjs.com/package/assert NPM:assert}
 * @see {@link https://www.npmjs.com/package/stack-trace NPM:stack-trace}
 * @see {@link https://www.npmjs.com/package/path NPM:path}
 */

/**
 * Gets trace.
 * @type {stackTraceObject}
 */
module.exports = getTrace;
