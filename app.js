// Module dependencies
// test change gitflow again
/**
 * @fileOverview This is application
 *
 * @requires NPM:express
 * @requires NPM:dotenv
 * @requires NPM:dotenv-expand
 *
 * @requires config
 * @requires utils/hbsHelpers/hbsHelpers
 * @requires utils/hbsHelpers/yearsAccordion
 * @requires NPM:fullicu
 *
 * @requires config/logger
 * @requires config/mongoose
 * @requires config/express
 * @requires config/error
 * @requires utils/getRates
 */
const express = require('express');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Load environment variables from .env file, where API keys and passwords are configured.
const env = dotenv.config();
dotenvExpand(env);
if (env.error) {
  throw env.error;
}

// All configuration variables
const config = require('./config');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || config.NODE_ENV || 'development';

require('./utils/hbsHelpers/hbsHelpers');
require('./utils/hbsHelpers/yearsAccordion');
require('full-icu');

const { addLogger } = require('./config/logger');
const mongoConnection = require('./config/mongoose');
const expressConfiguration = require('./config/express');
const errorHandler = require('./config/error');
const getRates = require('./utils/getRates');

// Create logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

// Catch uncaught errors
process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node docs)
});

async function startServer() {
  Logger.info('App initializing');

  // Create express server
  const app = express();

  // Connect to MongoDB
  await mongoConnection();
  Logger.info('DB loaded and connected');

  // Express Configuration
  await expressConfiguration(app);
  Logger.info('Express loaded');

  // Function to check for rates at data.fixer.io and save them to DB
  await getRates();
  Logger.silly('Function getRates intialized!');

  // Error Handler.
  errorHandler(app);
  Logger.info('Error handler loaded');

  app.listen(config.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`Server listening on port: ${config.port}`);

    // Setup the event emitter to assume that app is running.
    // It's for tests.
    app.emit('appStarted');
  });
  return app;
}

const app = startServer();

exports.app = app;
