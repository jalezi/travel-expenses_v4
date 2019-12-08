/**
 * @author Jaka Daneu
 * @fileoverview Defines mongoose {@link module:models/Currency~Currency Currency model} based on
 * {@link module:models/Currency~Currency.CurrencySchema Currency schema}.
 * <p>{@link module:models/Currency Currency} module exports
 * {@link module:models/Currency~Currency Currency model}.</p>
 * @requires {@link https://www.npmjs.com/package/mongoose module:NPM:mongoose}
 * @requires module:config/logger.addLogger
 *
 * @see {@link module:models/Currency Currency module}
 * @see {@link module:models/Currency~Currency Currency model}
 * @see {@link module:models/Currency~Currency.CurrencySchema Currency schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */


/**
 * Defines mongoose {@link module:models/Currency~Currency Currency model} based on
 * {@link module:models/Currency~Currency.CurrencySchema Currency schema}.
 * <p>{@link module:models/Currency Currency} module exports
 * {@link module:models/Currency~Currency Currency model}.</p>
 * <p></p>
 * <p>It's mongoose {@link https://mongoosejs.com/docs/models.html model} and
 * the instance is called {@link https://mongoosejs.com/docs/documents.html document}.
 * </p>
 * @module
 * @exports {Model<Document, {}>} Currency
 * @example <caption> Example usage of Currency model</caption>
 * const currencyObject = {
 *   base: 'USA',
 *   date: new Date('2019-11-07'),
 *   rate['EUR']: 0.89
 * };
 * const currency = new Currency(currencyObject);
 * currency.save();
 * @see {@link module:models/Currency~Currency Currency model}
 * @see {@link module:models/Currency~Currency.CurrencySchema Currency schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

/** mongoose */
const mongoose = require('mongoose');

// const { addLogger } = require('../config/logger');

// const pathDepth = module.paths.length - 6;
// const Logger = addLogger(__filename, pathDepth);

/**
 * @description Represents Currency mongoose document.
 * <p>Actual object for creating new mongoose Schema has more complex definition. See source!</p>
 * Mongoose {@link https://mongoosejs.com/docs/validation.html#validation Validation} is based on this object.
 * @type {Object}
 * @memberof module:models/Currency~Currency
 * @property base <b>required</b>, base currency code
 * @property date <b>required</b>, date of rate
 * @property rate <b>required</b>, rate object with currency code
 * as key and rate value as value
 */
const currencySchemaObject = {
  base: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  rate: {
    type: Object,
    required: true
  }
};

/**
 * @description new mongoose.Schema(curencySchemaObject, {timestamps: true})
 * @type {mongoose.Schema}
 * @memberof module:models/Currency~Currency
 * @param (currencySchemaObject) currencySchemaObject
 * {@link module:models/Currency~Currency.currencySchemaObject currencySchemaObject}
 * @param {mongooseSchemaOptions} options {@link https://mongoosejs.com/docs/guide.html#options Schema Options}
 *
 * @see {@link module:models/Currency~Currency Currency model}
 * @see {@link module:models/Currency~Currency.currencySchemaObject currencySchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const CurrencySchema = new mongoose.Schema(
  currencySchemaObject, {
    timestamps: true
  }
);

/**
 * <i><u>currencyObject</u></i> has 3 properties and all are <b>mandatory</b>:
 * <p><b>base</b> - base currency code</p>
 * <p><b>date</b> - date of rate</p>
 * <p><b>rate</b> - object where key is currency code and value is actual rate</p>
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
 * {@link module:models/Currency~Currency.currencySchemaObject currencySchemaObject}.
 * @constructor Currency
 * @classdesc Every expense document in database has reference to particular currency document.
 * Multiple expense documents can have reference to the same currency document.
 * <br></br>
 * Currency document property rate matches to equivalent object in rates property of
 * {@link module:models/Rate~Rate.rateSchemaObject Rate} document.
 *
 * @param {currencyObject} currencyObject
 * {@link module:models/Currency~Currency.currencySchemaObject currencyObject}
 * @returns Currency document when using with new.
 * @example <caption> Example usage of Currency model</caption>
 * const currencyObject = {
 *   base: 'USA',
 *   date: new Date('2019-11-07'),
 *   rate['EUR']: 0.89
 * };
 * const currency = new Currency(currencyObject);
 * currency.save()
 * @see {@link module:models/Currency~Currency.CurrencySchema CurrencySchema}
 * @see {@link module:models/Currency~Currency.currencySchemaObject currencySchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 * @todo Implement property rate validation!
 */
const Currency = mongoose.model('Currency', CurrencySchema);

/**
 * @type {Model<Document, {}>}
 */
module.exports = Currency;
