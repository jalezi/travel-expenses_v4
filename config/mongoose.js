/* eslint-disable func-names */
const mongoose = require('mongoose');

// Logger
const LoggerClass = require('./LoggerClass');

const Logger = new LoggerClass('mongoose');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\mongoose INITIALIZING!');

const config = require('.');

/**
 * @fileoverview Connects to MongooDB with NPM:mongoose.
 *
 * @module config/mongoose
 * @author Jaka Daneu
 * @requires NPM:mongoose
 * @requires module:config/LoggerClass
 * @requires module:config
 * @see {@link https://www.npmjs.com/package/mongoose NPM:mongoose}
 */

/**
 * Connects to database.
 * @async
 */
module.exports = async () => {
  logger.debug('DB connecting');
  const { db } = config;

  // Mongoose connection events
  mongoose.connection.on('connecting', () => {
    logger.debug(
      `Mongoose connecting to: user: ${db.user}, host: ${db.host}, db: ${db.name}`
    );
  });
  mongoose.connection.on('connected', () => {
    logger.debug(
      `Mongoose connected to: user: ${db.user}, host: ${db.host}, db: ${db.name}`
    );
  });

  mongoose.connection.on('disconnecting', () => {
    logger.warn('Mongoose default connection is disconnecting!');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose default connection is disconnected!');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('Mongoose default connection is reconnected!');
  });

  mongoose.connection.on('close', () => {
    logger.info('Mongoose default connection is closed!');
  });

  mongoose.connection.on('error', err => {
    logger.error(err.message);
    logger.info(
      'MongoDB connection error. Please make sure MongoDB is running.'
    );
    process.exit();
  });

  const connection = await mongoose.connect(db.uri, config.mongooseOptions);

  process.on('SIGINT', async () => {
    await mongoose.connection.close(() => {
      logger.info(
        'Mongoose default connection is disconnected due to application termination!'
      );
      process.exit(0);
    });
  });

  return connection.connection.db;
};
