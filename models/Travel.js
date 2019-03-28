const mongoose = require('mongoose');

const User = require('../models/User');
const Expense = require('../models/Expense');
const Currency = require('../models/Currency');
const CurrencySchema = Currency.schema.paths;

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
  travelCurrencies: Object
}, {
  useNestedStrict: true,
  timestamps: true });

const Travel = mongoose.model('Travel', TravelSchema);

Travel.prototype.updateDateCurrenciesArray = function (userId, date, content) {
  let filter = {"_id": userId};
  let update = {"$addToSet": {}};
  let setter = {};
  setter['travelCurrencies.' + date] = content;
  update['$addToSet'] = setter;

  return this.collection.bulkWrite([
    { "updateOne": {
        "filter": filter,
        "update": update
    }}
]);

};

module.exports = Travel;
