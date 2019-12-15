<<<<<<< HEAD
/*
 * Expense Schema
 * travel: link to travel => travel._id from travels collection
 * type: possible expense type => ./lib/globals.expenseTypes
 * description: expense description
 * date: expense date
 * currency: TODO implement validation => length=3 & make upper case
 * curRate: link to currency => currency._id from currencies collection
 * unit: only if expense type is Mileage based on user's unit
 * (user.homeDistance) => userSchema in ./models/User.js
 * amount: amount spent in local currency or distance in unit
 * amountConverted: converted amount based on user's currency(homeCurrency) or
 * user's per distance conversion(user.perMileAmount) => userSchema in ./models/User.js
 * _user: link to user => user._id from users collection
 */
const mongoose = require('mongoose');
// const moment = require('moment');
// const {User} = require('../models/User');
// const {Travel} = require('../models/Travel');
// const {Currency} = require('../models/Currency');
const { ObjectId } = mongoose.Schema.Types;
=======
/* eslint-disable max-len */
const mongoose = require('mongoose');
>>>>>>> develop

// const { addLogger } = require('../config/logger');

// Logger
// const pathDepth = module.paths.length - 6;
// const Logger = addLogger(__filename, pathDepth);

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
