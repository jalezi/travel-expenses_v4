<<<<<<< HEAD
/*
 * Rates Schema
 * Same object as data from data.fixer.io
 * success: if response was successful
 * timestamp: when was data collected in Unix timestamp -
 *  multiple with 1000 to get time in milliseconds and then convert to date
 * base: for which currency are rates
 * rates: object with all rates to convert from => {USD: 1.12, HRK: 7.45, GBP: 0.88, ....}
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 */
=======
/* eslint-disable func-names */
/* eslint-disable quote-props */
>>>>>>> develop
const mongoose = require('mongoose');

const { addLogger } = require('../config/logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

// Represents Rate mongoose document
const rateSchemaObject = {
  success: Boolean,
  timestamp: Number,
  base: String,
  date: Date,
  rates: Object
<<<<<<< HEAD
},
{ timestamps: true });
=======
};

// Rate Schema
const RateSchema = new mongoose.Schema(
  rateSchemaObject,
  { timestamps: true }
);
>>>>>>> develop

/*
 It finds Rate documents in travel document date range.
 It is Rate <b>model</b> static function.
 It has to be unnamed function! Otherwise we have to use bind.
 Returns Array with partial (date and rates properties)
 */
<<<<<<< HEAD
// eslint-disable-next-line func-names
RateSchema.statics.findRatesOnDate = function (travel) {
  return this.find({
    $and: [
      { date: { $gte: travel.dateFrom } },
      { date: { $lte: travel.dateTo } }]
  })
    // eslint-disable-next-line quote-props
    .select({ 'rates': 1, 'date': 1, '_id': 0 },);
};

/*
 * Returns array with rate close to travel dates
 * Use in case there is no rate for date between travel dates
 * Rates are sorted ascending.
 * Limit to only one rates object.
 * keys: [rates, date]
 * TODO check if you can get better algorithm
 */
RateSchema.statics.findRateBeforeOrAfterDate = (travel) => this.find({
  $or: [{ date: { $gte: travel.dateFrom } },
    { date: { $lte: travel.dateFrom } }]
})
  .sort({ date: 1 })
  .limit(1)
// eslint-disable-next-line quote-props
  .select({ 'rates': 1, 'date': 1, '_id': 0 },);
=======
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


/*
 It finds document closest to travel document date range.
 It is Rate <b>model</b> static function.
 It has to be unnamed function! Otherwise we have to use bind.
 Returns Array with one partial (date and rate property)
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
>>>>>>> develop


// Rate model
const Rate = mongoose.model('Rate', RateSchema);


module.exports = Rate;
