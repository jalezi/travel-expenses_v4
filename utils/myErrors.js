/* eslint-disable max-classes-per-file */

// My custom errors module

class ImportFileError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ImportFileError);
    this.name = 'ImportFileError';
  }
}


class SaveToDbError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, SaveToDbError);
    this.name = 'SaveToDbError';
  }
}

exports.ImportFileError = ImportFileError;

exports.SaveToDbError = SaveToDbError;
