const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment');

const Rate = require('../models/Rate');

const { addLogger } = require('../config/logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const dataFixier = async () => {
  try {
    const response = await axios.get(
      `http://data.fixer.io/api/latest?access_key=${process.env.DATA_FIXER_IO}`
    );
    if (
      response.data.success &&
      moment(response.data.date).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')
    ) {
      /** @type {rates} */
      const data = new Rate(response.data);
      await data.save().then(rates => {
        Logger.info(
          `Rates for ${moment(rates.date)},\ncollected on ${new Date(
            rates.timestamp * 1000
          )},\ncreated on ${moment(rates.createdAt)}`
        );
      });
    } else if (
      moment(response.data.date).format('YYYY-MM-DD') !==
      moment().format('YYYY-MM-DD')
    ) {
      Logger.info(
        `Wrong response data date: ${moment(response.data.date).format(
          'YYYY-MM-DD'
        )} - Should be ${moment().format('YYYY-MM-DD')}`
      );
    } else {
      Logger.warn("Couldn't get rates from data.fixer.io");
      Logger.warn(response.data);
    }
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Check if today rates already exists in DB,
 *  resolve as array of rates documents(objects), reject as error
 * @type {Promise}
 * @var {string} today  Now YYYY-MM-DD format
 * @var {object} rates  Info about rates or error
 * @resolve             Promise<Rate> Array of MongoDB documents
 * @reject              Error
 */
const checkDbForTodayRates = new Promise((resolve, reject) => {
  const today = moment(new Date()).format('YYYY-MM-DD');
  try {
    const rates = Rate.find({ date: today });
    resolve(rates);
  } catch (err) {
    reject(err);
  }
});

/**
 * Get rates from data.fixer.io/api, save them to DB and
 * creates job to check every hour if we have rates in DB.
 *
 * @description Get Rates
 * @var {string} today Now YYYY-MM-DD format
 */
module.exports = async () => {
  const today = moment().format('YYYY-MM-DD');
  checkDbForTodayRates
    .then(rates => {
      if (rates.length === 0) {
        Logger.info(
          `${moment(
            new Date()
          )} - Rates for ${today} not yet in DB. Retrieving rates...`
        );
        dataFixier();
      } else {
        Logger.info(`${moment(new Date())} - Rates for ${today} already in DB`);
      }
    })
    .catch(err => {
      Logger.error(err);
    });

  const rule = new schedule.RecurrenceRule();
  rule.minute = 1;

  const job = schedule.scheduleJob(rule, () => {
    const today = moment().format('YYYY-MM-DD');
    try {
      const rates = checkDbForTodayRates;
      if (rates.length === 0) {
        Logger.info(
          `${moment(
            new Date()
          )} - Rates for ${today} not yet in DB. Retrieving rates...`
        );
        dataFixier();
      } else {
        Logger.info(`${moment(new Date())} - Rates for ${today} already in DB`);
      }
    } catch (err) {
      Logger.error(err);
    }
  });
  return job;
};
