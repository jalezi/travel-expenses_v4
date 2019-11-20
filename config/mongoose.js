/* eslint-disable func-names */
const mongoose = require('mongoose');
// const { Db } = require('mongodb');
// const chalk = require('chalk');

const { addLogger } = require('./logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const config = require('../config');


module.exports = async () => {
  Logger.debug('DB connecting');
  const dbURL = config.databaseURL;
  /**
   * Mongoose connection events
   */
  mongoose.connection.on('connecting', () => {
    Logger.info(`Mongoose connecting to: ${dbURL}`);
  });
  mongoose.connection.on('connected', () => {
    Logger.info(`Mongoose connected to: ${dbURL}`);
  });

  mongoose.connection.on('disconnecting', () => {
    Logger.warn('Mongoose default connection is disconnecting!');
  });

  mongoose.connection.on('disconnected', () => {
    Logger.warn('Mongoose default connection is disconnected!');
  });

  mongoose.connection.on('reconnected', () => {
    Logger.info('Mongoose default connection is reconnected!');
  });

  mongoose.connection.on('close', () => {
    Logger.info('Mongoose default connection is closed!');
  });

  mongoose.connection.on('error', err => {
    Logger.error(err);
    Logger.info(
      'MongoDB connection error. Please make sure MongoDB is running.'
    );
    process.exit();
  });

  const connection = await mongoose.connect(dbURL, config.mongooseOptions);

  process.on('SIGINT', async () => {
    await mongoose.connection.close(() => {
      Logger.info(
        'Mongoose default connection is disconnected due to application termination!'
      );
      process.exit(0);
    });
  });

  return connection.connection.db;
};
