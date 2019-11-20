const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

const myErrors = require('../utils/myErrors');
const { addLogger } = require('./logger');

const { ImportFileError } = myErrors;

// Create logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = app => {
  Logger.debug('errorHandler initialize');
  if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(
      errorHandler({
        log: (err, str) => {
          if (
            err instanceof ImportFileError ||
            err instanceof mongoose.CastError
          ) {
            console.log(str);
          } else {
            console.log(err);
          }
        }
      })
    );
  } else {
    app.use((err, req, res, next) => {
      if (err instanceof ImportFileError) {
        console.log(err.stack);
        res.status(400);
        res.redirect(req.path);
      } else if (err instanceof mongoose.CastError) {
        console.log(err.stack);
        res.status(400);
        res.redirect('/travels');
      } else {
        console.log(err);
        res.status(500).render('error', {
          layout: 'errorLayout',
          title: 'Error'
        });
      }
    });
  }
};
