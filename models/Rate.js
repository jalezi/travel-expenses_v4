/* eslint-disable func-names */
/* eslint-disable quote-props */

/**
 * @author Jaka Daneu
 * @fileoverview Defines mongoose {@link module:models/Rate~Rate Rate model} based on
 * {@link module:models/Rate~Rate.RateSchema Rate Schema}.
 * <p>{@link module:models/Rate Rate} module exports
 * {@link module:models/Rate~Rate Rate Model}</p>
 * @requires {@link https://www.npmjs.com/package/mongoose module:NPM:mongoose}
 * @requires config/logger.addLogger
 * @see {@link module:models/Rate Rate module}
 * @see {@link module:models/Rate~Rate Rate Model}
 * @see {@link module:models/Rate~Rate.RateSchema Rate Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

/**
  * Defines mongoose {@link module:models/Rate~Rate Rate Model} based on
  * {@link module:models/Rate~Rate.RateSchema Rate Schema}.
  * <p>{@link module:models/Rate Rate} module exports
  * {@link module:models/Rate~Rate Rate Model}.</p>
  * @module
  * @example
  * const rateObject = {
  *   success: true,
  *   timestamp: Number,
  *   base: EUR,
  *   date: new Date('2019-11-7'),
  *   rates: [{USA: 1.12}, {HRK: 7.53}, [...]
  * };
  * rate = new Rate(rateObject);
  * rate.save();
  * }
  * @see {@link module:models/Rate~Rate Rate Model}
  * @see {@link module:models/Rate~Rate.RateSchema Rate Schema}
  * <p></p>
  * @see {@link module:utils/getRates getRates()}
  * <p></p>
  * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
  * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
  */

/** mongoose */
const mongoose = require('mongoose');
/** addLogger */
const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

/**
 * @description Represents Rate mongoose document.
 * <p>Actual object for creating new mongoose Schema has more complex definition. See source!</p>
 * This object is based on {@link https://fixer.io/documentation#apiresponse Fixer Api} response.
 * Mongoose {@link https://mongoosejs.com/docs/validation.html#validation Validation} is based on this object.
 *
 * @type {Object}
 * @memberof module:models/Rate~Rate
 * @property {Boolean} success whether was response successful
 * @property {Number} timestamp when was response created
 * @property {String} base base currency
 * @property {Date} date date for rates
 * @property {Object} rates rates
 */
const rateSchemaObject = {
  success: Boolean,
  timestamp: Number,
  base: String,
  date: Date,
  rates: Object
};

/**
 * @type {mongoose.Schema}
 * @description new mongoose.Schema(rateSchemaObject, {timestamps: true})
 * @memberof module:models/Rate~Rate
 * @param {rateschemaObject} rateSchemaObject
 * {@link module:models/Rate~Rate.rateSchemaObject rateSchemaObject}
 * @param {mongooseSchemaOptions} options {@link https://mongoosejs.com/docs/guide.html#options Schema Options}
 *
 * <p></p>
 * @see {@link module:models/Rate~Rate Rate model}
 * @see {@link module:models/Rate~Rate.rateSchemaObject rateSchemaObject}
 * @see {@link module:utils/getRates getRates()}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const RateSchema = new mongoose.Schema(
  rateSchemaObject,
  { timestamps: true }
);

/**
 *
 * @description It finds Rate documents in travel document date range.
 * <p></p>
 * It is Rate <b>model</b> static function.
 * <p></p>
 * It has to be unnamed function! Otherwise we have to use bind.
 * @function findRatesOnDate
 * @memberof module:models/Rate~Rate
 * @this module:models/Rate~Rate.RateSchema
 * @param {Travel} travel travel document for which we want to find
 * @returns Array with partial (date and rates properties)
 * Rate document objects where date is in travel dates range.
 *
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


/**
 *
 * @description It finds document closest to travel document date range.
 * <p></p>
 * It is Rate <b>model</b> static function.
 * <p></p>
 * It has to be unnamed function! Otherwise we have to use bind.
 * @function findRateBeforeOrAfterDate
 * @memberof module:models/Rate~Rate
 * @this module:models/Rate~Rate.RateSchema
 * @param {Travel} travel
 * @returns Array with one partial (date and rate property)
 * Rate document where date is closest to travel dates.
 *
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


/**
 * <i><u>rateObject</u></i> has 5 properties:
 * <p><b>success</b> - whether the response was successful</p>
 * <p><b>timestamp</b> - when was response retrived</p>
 * <p><b>base</b> - for which currency are rates</p>
 * <p><b>date</b> - for which date are rates</p>
 * <p><b>rates</b> - rates as object with key as currency code and value as rate value</p>
 * <i>Mongoose new mongoose.Schema({...}, options) creates additional properties</i>:
 * <b>_id</b>, <b>__v</b>, <b>createdAt</b> and <b>updatedAt</b>, first two by default,
 * second two when passing {timesatmps: true} as second argument.
 * <br></br>
 * It's mongoose {@link https://mongoosejs.com/docs/models.html model} and
 * the instance is called {@link https://mongoosejs.com/docs/documents.html document}.
 * <p></p>
 * Models are fancy constructors compiled from Schema definitions.
 * An instance of a model is called a document.
 * Models are responsible for creating and reading documents from the underlying MongoDB database.
 * <p></p>
 * {@link https://mongoosejs.com/docs/validation.html#validation Validation} is based on
 * {@link module:models/Rate~Rate.rateSchemaObject rateSchemaObject}.
 *
 * @constructor Rate
 * @classdesc
 * Application uses this constructor only when retrieving data from
 * {@link https://fixer.io/documentation#apiresponse Fixer Api}.
 * See {@link module:utils/getRates getRates()}
 * @param {ratesObject} [ratesObject={}] {@link module:models/Rate~Rate.rateSchemaObject rateObject}
 * @returns Rate document when using with new.
 * @example
 * const rateObject = {
 *   success: true
 *   timestamp: Number,
 *   base: EUR,
 *   date: new Date('2019-11-7'),
 *   rates: [{USA: 1.12}, {HRK: 7.53}, [...]
 * };
 * rate = new Rate(rateObject);
 * rate.save();
}
 * @see {@link module:models/Rate~Rate.RateSchema RateSchema}
 * @see {@link module:models/Rate~Rate.rateSchemaObject rateSchemaObject}
 * @see {@link module:utils/getRates getRates()}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const Rate = mongoose.model('Rate', RateSchema);

/**
 * Expense model
 * @type {Model<Document, {}>}
 */
module.exports = Rate;
