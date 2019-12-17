/* eslint-disable func-names */
/* eslint-disable quote-props */
const mongoose = require('mongoose');
const moment = require('moment');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('Currency');
const { mainLogger, logger } = Logger;
mainLogger.debug('models\\Currency INITIALIZING!');

// Represents Rate mongoose document
const rateSchemaObject = {
  success: Boolean,
  timestamp: Number,
  base: String,
  date: Date,
  rates: Object
};

// Rate Schema
const RateSchema = new mongoose.Schema(
  rateSchemaObject,
  { timestamps: true }
);

/*
 It finds Rate documents in travel document date range.
 It is Rate <b>model</b> static function.
 It has to be unnamed function! Otherwise we have to use bind.
 Returns Array with partial (date and rates properties)
 */
RateSchema.statics.findRatesOnDate = function (travel) {
  logger.debug('findRatesOnDate');
  return this.find({
    $and: [
      { date: { $gte: travel.dateFrom } }, { date: { $lte: travel.dateTo } }
    ]
  }, (err, doc) => {
    if (err) {
      logger.error(err.message);
    } else {
      const dateFrom = moment(travel.dateFrom).format('YYYY-MM-DD');
      const dateTo = moment(travel.dateTo).format('YYYY-MM-DD');
      logger.silly({ travel });
      logger.debug(`Find rates for date range: ${dateFrom} - ${dateTo}.`);
      logger.debug(`Find rates for ${doc.length} day(s)`);
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
  logger.debug('findRateBeforeOrAfterDate');
  return this.find({
    $or: [{ date: { $gte: travel.dateFrom } }, { date: { $lte: travel.dateFrom } }]
  }, (err, doc) => {
    if (err) {
      logger.error(err.message);
    } else {
      logger.debug(`Find rates for date range from ${travel.dateFrom} to ${travel.dateTo}.`);
      logger.debug(`Find rates for ${doc.length} day(s)`);
    }
  })
    .sort({ 'date': 1 })
    .limit(1)
    .select({ 'rates': 1, 'date': 1, '_id': 0 },);
};


// Rate model
const Rate = mongoose.model('Rate', RateSchema);


module.exports = Rate;
