/*
 * Currency Schema
 * base: base currency => to currency
 * date: conversion date
 * rate: object => key: from currency, value: conversion rate
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 *
 * amount in rate currency divide with rate[currency]
 * converted amount = (amount in rate's key)/(currency.rate["EUR"])
 * EXAMPLE:
 * currency = {base: "USD", date: 2017-11-18T00:00:00.000+00:00, rate: {EUR: 0.89}}
 * convert 100 EUR to USD = 100/currency.rate["EUR"]
 * 100 EUR = 100/0.89 = 112.36 USD
 */
const mongoose = require('mongoose');

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

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
