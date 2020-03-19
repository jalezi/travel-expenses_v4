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
const dataFixer = async date => {
  logger.debug('dataFixer START');
  let response;
  const today = moment().format('YYYY-MM-DD');
  try {
    if (!date) {
      response = await axios.get(
        `http://data.fixer.io/api/latest?access_key=${process.env.DATA_FIXER_IO}`
      );
    } else {
      response = await axios.get(`http://data.fixer.io/api/${date}?access_key=${process.env.DATA_FIXER_IO}`);
    }
    const responseDate = moment(response.data.date).format('YYYY-MM-DD');
    logger.debug(
      `Response from rates server was successful: ${response.data.success}`
    );

    if (response.data.success && (responseDate === today || responseDate === date)) {
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
    logger.debug('dataFixer END');
    return response.data;
  } catch (err) {
    logger.debug('dataFixer ERROR');
    return err;
    // throw new Error(err);
  }
};


/*
 Check if today rates already exists in DB,
 Resolves as array of rates as mongoose documents
 Rejects as error
 */
const checkDbForTodayRates = async () =>
  new Promise((resolve, reject) => {
    const label = 'checkDbForTodayRates';
    const today = moment(new Date()).format('YYYY-MM-DD');
    logger.debug('checkDbForTodayRates START', { label });
    logger.info(`Cheking for rates for date: ${today} in DB`, { label });
    try {
      Rate.find({ date: today }, (err, docs) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.info(`Found ${docs.length} rates for ${today} in DB.`, {
          label
        });
        logger.debug('checkDbForTodayRates END', { label });
        resolve(docs);
      });
    } catch (err) {
      logger.debug(`checkDbForTodayRates ERROR - ${today}`, { label });
      logger.error(err.message, { label });
      reject(err);
    }
  });

const checkDbForMissingRates = async () => new Promise((resolve, reject) => {
  const label = 'checkDbForMissingRates';
  logger.debug('checkDbForMissingRates START', { label });
  Rate.aggregate([
    { $project: { date: 1, _id: 0 } },
    { $sort: { date: 1 } }
  ], (err, dates) => {
    if (err) {
      logger.error(`${err.message}`, { label });
      reject(err);
    }
    logger.debug(`Found rates for ${dates.length} days.`, { label });
    logger.debug('checkDbForMissingRates END', { label });
    const arr = dates.map(a => a.date);
    resolve(arr);
  });
});

const loopRatesDates = async arr => {
  const label = 'loopRatesDates';
  const day = 86400000;
  logger.debug('loopRatesDates START', { label });
  const today = moment().format('YYYY-MM-DD');
  const firstDate = moment(arr[0]).format('YYYY-MM-DD');
  const lastDate = moment(arr[arr.length - 1]).format('YYYY-MM-DD');
  logger.silly(`Today: ${today}`, { label });
  logger.silly(`Start: ${firstDate}`, { label });
  logger.silly(`End: ${lastDate}`, { label });

  const missingDateRanges = [];

  for (let index = 1; index < arr.length; index++) {
    const element = arr[index];
    const diff = element - arr[index - 1];
    if (diff > day) {
      const newRange = [arr[index - 1], element];
      missingDateRanges.push(newRange);
    }
  }
  logger.debug(`Missing dates ranges: ${missingDateRanges.length}`);
  logger.debug('loopRatesDates END', { label });
  return missingDateRanges;
};

const getDateArray = (start, end) => {
  const label = 'getDateArray';
  logger.debug('getDateArray START', { label });
  const arr = [];
  let dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  arr.shift();
  arr.pop();
  logger.debug('getDateArray END', { label });
  return arr;
};

const createMissingDatesArr = async arr => new Promise(resolve => {
  const label = 'createMissingDatesArr';
  logger.debug('createMissingDatesArr START', { label });
  const newArr = [];
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    const missingDates = getDateArray(element[0], element[1]);
    newArr.push(...missingDates);
  }

  logger.debug(`Missing rates: ${newArr.length}`, { label });
  logger.debug('createMissingDatesArr END', { label });
  resolve(newArr);
});

const getMissingRates = async () => {
  const label = 'getMissingRates';
  logger.debug('getMissingRates START', { label });
  const allRatesDates = await checkDbForMissingRates();
  if (allRatesDates instanceof Error) {
    logger.warn('Can not check Rates documents', { label });
  } else {
    const missingDateRanges = await loopRatesDates(allRatesDates);
    if (missingDateRanges.length > 0) {
      const missingDatesArr = await createMissingDatesArr(missingDateRanges);
      logger.debug(`Dates missing in DB: ${missingDatesArr.length}`, { label });
      for (let index = 0; index < missingDatesArr.length; index++) {
        const element = missingDatesArr[index];
        const date = moment(element).format('YYYY-MM-DD');
        dataFixer(date);
      }
    }
  }
  logger.debug('getMissingRates END', { label });
};

/*
 Get rates from data.fixer.io/api, save them to DB and
 Creates job to check every hour if we have rates in DB.
 */
module.exports = async () => {
  const today = moment().format('YYYY-MM-DD');
  logger.debug(`getRates START - ${today}`);
  const rates = await checkDbForTodayRates();
  logger.silly(`${rates.length} rates found!`);
  if (rates.length === 0) {
    logger.info(
      `${moment(
        new Date()
      )} - Rates for ${today} not yet in DB. Retrieving rates...`
    );
    await dataFixer();
  } else {
    logger.info(`${moment(new Date())} - Rates for ${today} already in DB`);
  }

  const rule = new schedule.RecurrenceRule();
  rule.minute = 1;
  const scheduleId = 'getRates job';
  const job = schedule.scheduleJob(scheduleId, rule, async () => {
    let responseData;
    const today = moment().format('YYYY-MM-DD');
    logger.debug(`${scheduleId} - START`, { label: scheduleId });
    let rates = await checkDbForTodayRates();
    logger.debug(`${rates.length} rates for ${today} in DB!`, {
      label: scheduleId
    });
    if (rates.length === 0) {
      logger.info(
        `${moment(
          new Date()
        )} - Rates for ${today} not yet in DB. Retrieving rates...`,
        { label: scheduleId }
      );
      responseData = await dataFixer();
    } else {
      logger.info(`${moment(new Date())} - Rates for ${today} already in DB`, {
        label: scheduleId
      });
    }
    if (responseData instanceof Error) {
      logger.error(responseData.message, { label: scheduleId });
    } else if (responseData) {
      logger.info(`${responseData.success}`, { label: scheduleId });
    } else {
      logger.info('No need to get response from dataFixer', {
        label: scheduleId
      });
    }

    rates = await checkDbForTodayRates();
    if (rates.length === 0) {
      logger.info('Change job schedule to minute!');
      job.reschedule('0 1 * * * *');
    } else if (rates.length === 1) {
      logger.info('Change job schedule for next day');
      job.reschedule('0 1 0 * * *');
    } else {
      logger.warn(`There is more than 1 rate for ${today}: ${rates.length}`);
    }

    await getMissingRates();

    logger.debug(`${scheduleId} END`, { label: scheduleId });
  });

  await getMissingRates();

  logger.debug(`getRates returns ${job.name}`);
  logger.debug(`getRates END - ${today}`);
  return job;
};
