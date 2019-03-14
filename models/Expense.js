const mongoose = require('mongoose');
const {User} = require('../models/User');
const {Travel} = require('../models/Travel');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ExpenseSchema = new mongoose.Schema({
  travel: {
    type: ObjectId,
    required: true,
    ref: 'Travel'
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  _creator: {
    type: ObjectId,
    required: true,
    ref: 'User'
  }
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
