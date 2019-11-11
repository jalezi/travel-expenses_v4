/* eslint-disable max-classes-per-file */
class importFileError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, importFileError);
    this.name = 'importFileError';
  }
}

class saveToDbError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, saveToDbError);
    this.name = 'saveToDbError';
  }
}

exports.importFileError = importFileError;
exports.saveToDbError = saveToDbError;
