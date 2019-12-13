const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

const myErrors = require('../utils/myErrors');
const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('passport');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\error REQUIRED!');

const { ImportFileError } = myErrors;


module.exports = app => {
  logger.debug('Error handler initializing');
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
