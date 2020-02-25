const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('getRates');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\getRates INITIALIZING!');

const Rate = require('../models/Rate');

/*
 Get rates from data.fixer.io. Save them to DB.
 Throws an error if something goes wrong
 */
const dataFixier = async () => {
  const today = moment().format('YYYY-MM-DD');
  try {
    const response = await axios.get(
      `http://data.fixer.io/api/latest?access_key=${process.env.DATA_FIXER_IO}`
    );
    const responseDate = moment(response.data.date).format('YYYY-MM-DD');

    if (response.data.success && responseDate === today) {
      const data = new Rate(response.data);
      await data.save().then(rates => {
        logger.info(`Rates for ${moment(rates.date)}.`);
        logger.info(`Collected on ${new Date(rates.timestamp * 1000)}.`);
        logger.info(`Created on ${moment(rates.createdAt)}.`);
      });
    } else if (responseDate !== today) {
      logger.warn(
        `Wrong response data date: ${responseDate} - Should be ${today}`
      );
    } else {
      logger.warn("Couldn't get rates from data.fixer.io");
      logger.warn(response.data);
    }
  } catch (err) {
    throw new Error(err);
  }
};

/*
 Check if today rates already exists in DB,
 Resolves as array of rates as mongoose documents
 Rejects as error
 */
const checkDbForTodayRates = async () => new Promise((resolve, reject) => {
  const today = moment(new Date()).format('YYYY-MM-DD');
  logger.debug(`checkDbForTodayRates STARTS - ${today}`);
  try {
    Rate.find({ date: today }, (err, docs) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      logger.debug(`Found ${docs.length} rates in DB.`);
      logger.debug(`checkDbForTodayRates ENDS - ${today}`);
      resolve(docs);
    });
  } catch (err) {
    logger.debug(`checkDbForTodayRates ERROR - ${today}`);
    reject(err);
  }
});

/*
 Get rates from data.fixer.io/api, save them to DB and
 Creates job to check every hour if we have rates in DB.
 */
module.exports = async () => {
  const today = moment().format('YYYY-MM-DD');
  logger.debug(`getRates STARTS - ${today}`);
  const rates = await checkDbForTodayRates();
  logger.debug(`${rates.length} rates found!`);
  if (rates.length === 0) {
    logger.info(
      `${moment(
        new Date()
      )} - Rates for ${today} not yet in DB. Retrieving rates...`
    );
    await dataFixier();
  } else {
    logger.info(`${moment(new Date())} - Rates for ${today} already in DB`);
  }


  const rule = new schedule.RecurrenceRule();
  rule.minute = 1;
  const scheduleId = 'getRates job';
  const job = schedule.scheduleJob(scheduleId, rule, async () => {
    const today = moment().format('YYYY-MM-DD');
    logger.debug(`${scheduleId} - ${today}`);
    const rates = await checkDbForTodayRates();
    logger.debug(`${scheduleId} - ${rates.length} found!`);
    if (rates.length === 0) {
      logger.info(`${moment(new Date())} - Rates for ${today} not yet in DB. Retrieving rates...`);
      dataFixier();
    } else {
      logger.info(`${moment(new Date())} - Rates for ${today} already in DB`);
    }
  });

  logger.debug(`getRates returns ${job.name}`);
  return job;
};
