class imprortFileError extends Error {
  constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, imprortFileError);

    }
}

exports.imprortFileError = imprortFileError;
