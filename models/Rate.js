/* eslint-disable func-names */
/* eslint-disable quote-props */
/**
 * Rates Schema
 * Same object as data from data.fixer.io
 * success: if response was successful
 * timestamp: when was data collected in Unix timestamp -
 * multiple with 1000 to get time in milliseconds and then convert to date
 * base: for which currency are rates
 * rates: object with all rates to convert from => {USD: 1.12, HRK: 7.45, GBP: 0.88, ....}
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 */
const mongoose = require('mongoose');

const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const RateSchema = new mongoose.Schema({
  success: Boolean,
  timestamp: Number,
  base: String,
  date: Date,
  rates: Object
},
{ timestamps: true });

/**
 * Returns array with rates between two dates.
 * keys: [rates, date]
 *
 * It has to be unnamed function!
 * Otherwise you should use bind(Rate) when calling
 */
RateSchema.statics.findRatesOnDate = function(travel) {
  Logger.debug('findRatesOnDate');
  return this.find({
    $and: [
      { date: { $gte: travel.dateFrom } }, { date: { $lte: travel.dateTo } }
    ]
  }, (err, doc) => {
    if (err) {
      Logger.error(err.message);
    } else {
      Logger.debug(`Find rates for date range from ${travel.dateFrom} to ${travel.dateTo}.`);
      Logger.debug(`Find rates for ${doc.length} day(s)`);
    }
  }).select({ 'rates': 1, 'date': 1, '_id': 0 });
};


// TODO check if you can get better algorithm
/**
 * Returns array with rate close to travel dates
 * Use in case there is no rate for date between travel dates
 * Rates are sorted ascending.
 * Limit to only one rates object.
 * keys: [rates, date]
 *
 * It has to be unnamed function!
 * Otherwise you should use bind(Rate) when calling
 */
RateSchema.statics.findRateBeforeOrAfterDate = function (travel) {
  Logger.debug('findRateBeforeOrAfterDate');
  return this.find({
    $or: [{ date: { $gte: travel.dateFrom } }, { date: { $lte: travel.dateFrom } }]
  }, (err, doc) => {
    if (err) {
      Logger.error(err.message);
    } else {
      Logger.debug(`Find rates for date range from ${travel.dateFrom} to ${travel.dateTo}.`);
      Logger.debug(`Find rates for ${doc.length} day(s)`);
    }
  })
    .sort({ 'date': 1 })
    .limit(1)
    .select({ 'rates': 1, 'date': 1, '_id': 0 },);
};

const Rate = mongoose.model('Rate', RateSchema);

module.exports = Rate;
