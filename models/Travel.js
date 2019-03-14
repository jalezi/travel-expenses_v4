const mongoose = require('mongoose');
const User = require('../models/User');
const Expense = require('../models/Expense');
const ObjectId = mongoose.Schema.Types.ObjectId;

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
    default: 0
  },
  expenses: [{
    type: ObjectId,
    ref: 'Expense'
  }]
});

const Travel = mongoose.model('Travel', TravelSchema);

module.exports = Travel;
