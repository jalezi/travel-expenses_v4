class imprortFileError extends Error {
  constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, imprortFileError);
        this.name = 'imprortFileError';

    }
}

exports.imprortFileError = imprortFileError;
