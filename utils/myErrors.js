class imprortFileError extends Error {
  constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, imprortFileError);
        this.name = 'imprortFileError';

    }
}

class saveToDbError extends Error {
  constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, saveToDbError);
        this.name = 'saveToDbError';

    }
}

exports.imprortFileError = imprortFileError;
exports.saveToDbError = saveToDbError;
