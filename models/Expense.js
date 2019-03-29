const mongoose = require('mongoose');
const moment = require('moment');
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
    type: String
  },
  unit: {
    type: String
  },
  amount: {
    type: mongoose.Decimal128
  },
  amountConverted: {
    type: mongoose.Decimal128,
    default: 0.00
  },
  _user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

ExpenseSchema.methods.findRate = async function(callback) {
  const invoiceDate = moment(this.date).format('YYYY-MM-DD');
  const currency = this.currency;
  if (this.type != 'Mileage') {
    await mongoose.model('Travel').findOne({_id: this.travel}, (err, travel) => {
      let dayCurrencies = travel.travelCurrencies[invoiceDate];
      let rate = dayCurrencies.find(cur => cur[currency]);
      callback(err, rate);
    }).select({'travelCurrencies': 1, '_id': 0});
  } else {
    await mongoose.model('Travel').findOne({_id: this.travel}, (err, travel) => {
      let rate = travel.perMileAmount;
      callback(err, rate);
    }).select({'perMileAmount': 1, '_id': 0});
  }

}

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
