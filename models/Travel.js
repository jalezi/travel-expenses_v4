const mongoose = require('mongoose');

const User = require('../models/User');
const Expense = require('../models/Expense');
// const Currency = require('../models/Currency');
// const CurrencySchema = Currency.schema.paths;

const ObjectId = mongoose.Schema.Types.ObjectId;

const TravelSchema = new mongoose.Schema({
  _user: {
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
    type: mongoose.Decimal128,
    default: 0.00
  },
  expenses: [{
    type: ObjectId,
    ref: 'Expense'
  }],
  total: {
    type: mongoose.Decimal128,
    default: 0.00
  }
}, {
  useNestedStrict: true,
  timestamps: true });

TravelSchema.methods.updateTotal = function  (cb) {
  let total = 0;
  this.expenses.forEach((expense) => {
    total = total + Number(expense.amountConverted);
  });
  return total;
}

const Travel = mongoose.model('Travel', TravelSchema);

module.exports = Travel;
