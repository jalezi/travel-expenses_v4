/* eslint-disable max-classes-per-file */

/**
 * @fileOverview Application custom errors.
 *
 * @author Jaka Daneu
 */

/**
 * My custom errors module
 *
 * @module utils/myErrors
 * @property {class} ImportFileError Custom error
 * @property {class} SaveToDbError Custom error
 */

/**
 * Custom error
 *
 * @class
 * @extends {Error}
 * @property {string} name Error name
 *
 */
class ImportFileError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ImportFileError);
    this.name = 'ImportFileError';
  }
}

/**
 * Custom error
 *
 * @class
 * @extends {Error}
 * @property {string} name Error name
 */
class SaveToDbError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, SaveToDbError);
    this.name = 'SaveToDbError';
  }
}

/**
 * ImportFileError
 * @type {ImportFileError}
 * @property {string} name Error name
 */
exports.ImportFileError = ImportFileError;
/**
 * SaveToDbError
 *
 * @type {SaveToDbError}
 * @property {string} name Error name
 */
exports.SaveToDbError = SaveToDbError;
