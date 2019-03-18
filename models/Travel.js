const mongoose = require('mongoose');
const User = require('../models/User');
const Expense = require('../models/Expense');
const ObjectId = mongoose.Schema.Types.ObjectId;

const CurrencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: 1
  }
},  {useNestedStrict: true });

const TravelSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  description: {
    type: String,
    required: true
  },
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date,
    required: true
  },
  homeCurrency: {
    type: String,
    required: true
  },
  perMileAmount: {
    type: Number,
    default: 0.00
  },
  expenses: [{
    type: ObjectId,
    ref: 'Expense'
  }],
  total: {
    type: Number,
    default: 0.00
  },
  travelCurrencies: [{
      currency: CurrencySchema
  }]
});

const Travel = mongoose.model('Travel', TravelSchema);

module.exports = Travel;
