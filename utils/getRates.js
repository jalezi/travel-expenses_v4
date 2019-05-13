const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment');
const Rate = require('../models/Rate');

/*
 * Retrieve rates from data.fixer.io and save it to DB
 * @param {string} today                    Now YYYY-MM-DD format
 * @param {object} response                 Axios response from data.fixer.io/api/latest
 * @param {boolean} response.data.success
 * @param {number} response.data.timestamp
 * @param {string} response.data.base       Base currency - 3 capital letters
 * @param {string} response.data.date       Date for rates
 * @param {object} response.data.rates      Object with keys as rates (3 capital letters), values as rate
 * @param {object} data                     Mongoose Rate model - see /models/Rate.js
 */
const dataFixier = async () => {
  try {
    const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.DATA_FIXER_IO}`);
    if (response.data.success) {
      const data = new Rate(response.data);
      await data.save().then((rates) => {
        console.log(`Rates for ${moment(rates.date)},\ncollected on ${new Date(rates.timestamp*1000)},\ncreated on ${moment(rates.createdAt)}`);
      });
    } else {
        console.log(`Could't get rates from data.fixer.io`);
        console.log(response.data);
    }
  } catch (err) {
    throw new Error(err);
  }
}

/*
 * @typedef Rate
 * @param {boolean} success
 * @param {number} timestamp
 * @param {string} base
 * @param {string} date
 * @param {object} rates
 */

/*
 * Check if today rates alredy exists in DB, resolve as array of rates documents(objects), reject as error
 * @param {string} today Now YYYY-MM-DD format
 * @param {object} rates Info about rates or error
 * @return Promise<Rate> Array of MongoDB documents
 */
const checkDbForTodayRates = new Promise(async function(resolve, reject) {
  const today = moment().format('YYYY-MM-DD');
  try {
    const rates = await Rate.find({date: today});
    resolve(rates);
  } catch (err) {
    reject(err);
  }
});

/*
 * getRates module
 * const getRates = require(./getRates)
 * Use it once after connectef to DB - getRates()
 * It checks imediatelly if for today document exists in database and
 * creates new node-schedule job to repeat every first minute in the hour
 * module: utils/getRates
 * @param {string} today Now YYYY-MM-DD format
 */

/** GET RATES FROM DATA.FIXER.IO/API. */
module.exports = async () => {
  const today = moment().format('YYYY-MM-DD');
  checkDbForTodayRates.then((rates) => {
    if (rates.length === 0) {
      console.log(`${moment(new Date())} - Rates for ${today} not yet in DB. Retrieving rates...`);
      dataFixier();
    } else {
      console.log(`${moment(new Date())} - Rates for ${today} already in DB`);
    }
  }).catch( err => {
      console.log(err);
  });

  const rule = new schedule.RecurrenceRule();
  rule.minute = 1;

  const job = schedule.scheduleJob(rule, function() {
    const today = moment().format('YYYY-MM-DD');
    try {
      const rates = checkDbForTodayRates;
      if (rates.length === 0) {
        console.log(`${moment(new Date())} - Rates for ${today} not yet in DB. Retrieving rates...`);
        dataFixier();
      } else {
        console.log(`${moment(new Date())} - Rates for ${today} already in DB`);
      }
    } catch (err) {
      console.log(err);
    }
  });
}
