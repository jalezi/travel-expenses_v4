/* eslint-disable max-classes-per-file */
<<<<<<< HEAD
=======

// My custom errors module

>>>>>>> develop
class ImportFileError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ImportFileError);
    this.name = 'ImportFileError';
  }
}

<<<<<<< HEAD
=======

>>>>>>> develop
class SaveToDbError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, SaveToDbError);
    this.name = 'SaveToDbError';
  }
}

exports.ImportFileError = ImportFileError;
<<<<<<< HEAD
=======

>>>>>>> develop
exports.SaveToDbError = SaveToDbError;
