/* eslint-disable func-names */
/* eslint-disable quote-props */

/**
 * @fileoverview Defines mongoose {@link module:models/Rate~Rate Rate} based on
 * {@link module:models/Rate~RateSchema Rate Schema}.
 * <p>{@link module:Rate models/Rate} module exports {@link module:models/Rate~Rate Rate Model}.</p>
 * 
 * @see {@link module:models/Rate Rate Module}
 * @see Class {@link module:models/Rate~Rate Rate }
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

 /**
  * Defines mongoose {@link module:models/Rate~Rate Rate Model} based on
  * {@link module:models/Rate~RateSchema Rate Schema}.
  * <p>{@link module:models/Rate Rate} module exports {@link module:models/Rate~Rate Rate Model}.</p>
  * @module
  * @see Class {@link module:models/Rate~Rate Rate}
  * <p></p>
  * @see {@link module:utils/getRates getRates()}
  * <p></p>
  * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
  * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
  */

const mongoose = require('mongoose');

const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

/**
 * @constant
 * @memberof module:models/Rate~Rate
 * @property {boolean} success
 * @property {boolean} timestamp
 * @property {String} base
 * @property {Date} date
 * @property {Object} rates
 */
const rateSchemaObject = {
  success: Boolean,
  timestamp: Number,
  base: String,
  date: Date,
  rates: Object
}

/**
 * This is Constructor Rate description
 * @constructor Rate
 * @classdesc {@link module:models/Rate~Rate.rateSchemaObject rateSchemaObject}
 * is the same object as data from {@link https://fixer.io/documentation#apiresponse Fixer Api} response.
 * The only difference is that we add mongoose timestamps.
 * @param {rateschemaObject} rateSchemaObject {@link module:models/Rate~Rate.rateSchemaObject rateSchemaObject}
 * <p></p>
 * @see {@link module:utils/getRates getRates()}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const RateSchema = new mongoose.Schema(
  rateSchemaObject,
{ timestamps: true });

/**
 * 
 * @description Returns array with rates between two dates.
 * keys: [rates, date]
 * It has to be unnamed function!
 * Otherwise you should use bind(Rate) when calling Rate.findRatesOnDate
 * @function findRatesOnDate
 * @memberof module:models/Rate~Rate
 * @instance
 * @this module:models/Rate~Rate
 * @param {Travel} travel
 * @returns Rates on exact date
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

 
/**
 * @function findRateBeforeOrAfterDate
 * @memberof module:models/Rate~RateSchema
 * @this module:models/Rate~RateSchema
 * @param {*} travel
 * @returns hello
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
