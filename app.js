// Module dependencies
// test change gitflow again

const express = require('express');
// const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
// const path = require('path');

// Load environment variables from .env file, where API keys and passwords are configured.
// const env = dotenv.config({ path: path.resolve(__dirname, '.env') });
const { env } = process;
dotenvExpand(env);
if (env.error) {
  throw env.error;
}

// Logger
const LoggerClass = require('./config/LoggerClass');

const Logger = new LoggerClass('app');
const { mainLogger, logger } = Logger;

mainLogger.info("Let's get started!");

// All configuration variables
const config = require('./config');

// Set the NODE_ENV to 'development' by default
// process.env.NODE_ENV = process.env.NODE_ENV || config.NODE_ENV || 'development';

// Register express-hbs helpers
require('./utils/hbsHelpers');

// full-icu
require('full-icu');

const mongoConnection = require('./config/mongoose');
const expressConfiguration = require('./config/express');
const errorHandler = require('./config/error');
const getRates = require('./utils/getRates');
const dbAutoBackUp = require('./utils/dbBackup/job');

// Catch uncaught errors
process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node docs)
});

/**
 * Starts express server
 * @private
 * @memberof module:app
 * @async
 * @function StartServer
 * @returns {Promise<Express>} Express server.
 */
async function startServer() {
  logger.info('App initializing');

  // Create express server
  const app = express();

  // Connect to MongoDB
  await mongoConnection();
  logger.info(`DB: ${config.db.name} loaded and connected`);

  // Express Configuration
  await expressConfiguration(app);
  logger.info('Express loaded');

  // Function to check for rates at data.fixer.io and save them to DB
  await getRates();
  logger.silly('Function getRates intialized!');

  await dbAutoBackUp();
  logger.silly('Function dbAutoBackUp initialized');

  // Error Handler.
  errorHandler(app);
  logger.info('Error handler loaded');

  const { port } = config;

  if (!module.parent) {
    app.listen(port, err => {
      if (err) {
        logger.error(err.message);
        process.exit(1);
        return;
      }
      logger.info(`Server listening on port: ${port}`);

      // Setup the event emitter to assume that app is running.
      // It's for tests.
      app.emit('appStarted');
    });
  }
  return app;
}

const app = startServer();

/**
 * @fileoverview This is main module to start application.
 *
 * @module app
 * @author Jaka Daneu
 * @requires NPM:express
 * @requires NPM:dotenv
 * @requires NPM:dotenv-expand
 * @requires NPM:full-ico
 * @requires config
 * @requires config/express
 * @requires config/error
 * @requires config/LoggerClass
 * @requires config/mongoose
 * @requires utils/hbsHelpers
 * @requires utils/getRates
 * @see {@link https://www.npmjs.com/package/express NPM:express}
 * @see {@link https://www.npmjs.com/package/dotenv NPM:dotenv}
 * @see {@link https://www.npmjs.com/package/dotenv-expand NPM:dotenv-expand}
 * @see {@link https://www.npmjs.com/package/full-icu NPM:full-icu}
 */

/**
 * Express server.
 * It is used in mocha tests.
 * @memberof module:app
 * @alias app
 * @type {Promise<Express>}
 */
exports.app = app;
