const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment');

const Rate = require('../models/Rate');
const { addLogger } = require('../config/logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

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
        Logger.info(`Rates for ${moment(rates.date)}.`);
        Logger.info(`Collected on ${new Date(rates.timestamp * 1000)}.`);
        Logger.info(`Created on ${moment(rates.createdAt)}.`);
      });
    } else if (responseDate !== today) {
      Logger.warn(
        `Wrong response data date: ${responseDate} - Should be ${today}`
      );
    } else {
      Logger.warn("Couldn't get rates from data.fixer.io");
      Logger.warn(response.data);
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
const checkDbForTodayRates = new Promise((resolve, reject) => {
  const today = moment(new Date()).format('YYYY-MM-DD');
  try {
    const rates = Rate.find({ date: today });
    resolve(rates);
  } catch (err) {
    reject(err);
  }
});

/*
 Get rates from data.fixer.io/api, save them to DB and
 Creates job to check every hour if we have rates in DB.
 */
module.exports = async () => {
  const today = moment().format('YYYY-MM-DD');
  await checkDbForTodayRates
    .then(async rates => {
      if (rates.length === 0) {
        Logger.info(
          `${moment(
            new Date()
          )} - Rates for ${today} not yet in DB. Retrieving rates...`
        );
        await dataFixier();
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
