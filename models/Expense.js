/* eslint-disable max-len */
const mongoose = require('mongoose');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('Expense');
const { mainLogger } = Logger;
mainLogger.debug('models\\Expense INITIALIZING!');

const { ObjectId } = mongoose.Schema.Types;

// Represents Expense mongoose document
const expenseSchemaObject = {
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
    type: String
  },
  curRate: {
    type: ObjectId,
    ref: 'Currency'
  },
  unit: {
    type: String
  },
  amount: {
    type: mongoose.Decimal128
  },
  amountConverted: {
    type: mongoose.Decimal128,
    default: 0.0
  },
  _user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  }
};

// Expense Schema
const ExpenseSchema = new mongoose.Schema(
  expenseSchemaObject,
  { timestamps: true }
);

// Expense model
const Expense = mongoose.model('Expense', ExpenseSchema);


module.exports = Expense;
