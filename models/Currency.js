const mongoose = require('mongoose');

// const { addLogger } = require('../config/logger');

// Logger
// const pathDepth = module.paths.length - 6;
// const Logger = addLogger(__filename, pathDepth);

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
