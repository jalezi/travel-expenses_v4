const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

const LoggerClass = require('./LoggerClass');

const Logger = new LoggerClass('error');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\error INITIALIZING!');

const myErrors = require('../utils/myErrors');

const { ImportFileError } = myErrors;

/**
 * @fileoverview Sets Express and Node error handling.
 *
 * @module config/error
 * @author Jaka Daneu
 * @requires NPM:errorHandler
 * @requires NPM:mongoose
 * @requires module:utils/myErrors
 * @requires module:config/LoggerClass
 * @see {@link https://www.npmjs.com/package/errorhandler NPM:errorhandler}
 * @see {@link https://www.npmjs.com/package/mongoose NPM:mongoose}
 *
 */

/**
 * Different error handling for development and production.
 * @param {Express} app Express server Nodejs web framework.
 */
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
            logger.log(str);
          } else {
            logger.log(err);
          }
        }
      })
    );
  } else {
    app.use((err, req, res, next) => {
      if (err instanceof ImportFileError) {
        logger.log(err.stack);
        res.status(400);
        res.redirect(req.path);
      } else if (err instanceof mongoose.CastError) {
        logger.log(err.stack);
        res.status(400);
        res.redirect('/travels');
      } else {
        logger.log(err);
        res.status(500).render('error', {
          layout: 'errorLayout',
          title: 'Error'
        });
      }
    });
  }
};
