const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment');
const Rate = require('../models/Rate');


const dataFixier = async () => {
  try {
    const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.DATA_FIXER_IO}`);
    console.log(response.data);
    const data = new Rate({
      success: response.data.success,
      timestamp: response.data.timestamp,
      base: response.data.base,
      date: response.data.date,
      rates: response.data.rates
    });
    data.save();
  } catch (err) {
    throw new Error(err);
  }
}
// 8640000 = 24 hours
module.exports = async () => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const rates = await Rate.find({date: today});

    if (rates.length === 0) {
      console.log('rates.length=', rates.length);
      dataFixier();
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  const rule = new schedule.RecurrenceRule();
  rule.hour = 0;
  rule.minute = 1;

  const job = schedule.scheduleJob(rule, function() {
    console.log('Getting rates from data.fixer.io!');
    dataFixier();
  });
}
