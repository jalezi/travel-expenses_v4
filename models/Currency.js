const mongoose = require('mongoose');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('Currency');
const { mainLogger } = Logger;
mainLogger.debug('models\\Currency INITIALIZING!');

// Represent Currency mongoose document
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

// Currency Schema
const CurrencySchema = new mongoose.Schema(
  currencySchemaObject, {
    timestamps: true
  }
);

// Currency model
const Currency = mongoose.model('Currency', CurrencySchema);


module.exports = Currency;
