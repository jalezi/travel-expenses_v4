/* eslint-disable func-names */
/* eslint-disable quote-props */
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


// Rate model
const Rate = mongoose.model('Rate', RateSchema);


module.exports = Rate;
