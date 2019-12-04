/**
 * @fileoverview Defines mongoose {@link module:models/Currency~Currency Currency Model} based on
 * {@link module:models/Currency~CurrencySchema Currency Schema}.
 * <p>{@link module:models/Currency Currency} module exports {@link module:models/Currency~Currency Currency Model}.</p>
 * 
 * @example <caption> Example usage of Currency Model</caption>
 * const currencyObject = {
 * base: 'USA',
 * date: new Date('2019-11-07'),
 * rate['EUR']: 0.89 // rate: {EUR: 0.89}
 * };
 * const currency = new Currency(currencyObject);
 * 
 * @see {@link module:models/Currency Currency Module}
 * @see {@link module:models/Currency~Currency Currency Model}
 * @see {@link module:models/Currency~CurrencySchema Currency Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

/**
 * Defines mongoose {@link module:models/Currency~Currency Currency Model} based on
 * {@link module:models/Currency~CurrencySchema Currency Schema}.
 * <p>{@link module:models/Currency Currency} module exports {@link module:models/Currency~Currency Currency Model}.</p>
 * 
 * @module
 * @example <caption> Example usage of Currency Model</caption>
 * const currencyObject = {
 * base: 'USA',
 * date: new Date('2019-11-07'),
 * rate['EUR']: 0.89
 * };
 * const currency = new Currency(currencyObject);
 * @see {@link module:models/Currency~Currency Currency Model}
 * @see {@link module:models/Currency~CurrencySchema Currency Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const mongoose = require('mongoose');

/**
 * Currency Schema
 * @type {mongoose.Schema}
 * @property {String} base Base currency
 * @property {Date} date Conversion date
 * @property {Object} key: from currency, value: conversion rate
 * @property {Date} createdAt created with Mongoose Schema option {timestamps: true}
 * @property {Date} updatedAt reated with Mongoose Schema option {timestamps: true}
 * 
 * @see {@link module:models/Currency~Currency Currency Model}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const CurrencySchema = new mongoose.Schema({
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
}, {
  timestamps: true
});

/**
 * This is Constructor Currency Model description
 * @constructor Currency
 * @classdesc This is Class Currency Model description
 * @param {mongoose.Schema} CurrencySchema {@link module:models/Currency~CurrencySchema Currency Schema}
 * @example <caption> Example usage of Currency Model</caption>
 * const currencyObject = {
 * base: 'USA',
 * date: new Date('2019-11-07'),
 * rate['EUR']: 0.89
 * };
 * const currency = new Currency(currencyObject);
 * @see {@link module:models/Currency~CurrencySchema Currency Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
