/*
 * Travel Schema
 * _user: link to user => user._id from users collection
 * descprition: travel description
 * dateFrom: travel start date
 * dateTo: travel end date
 * homeCurrency: currency to calculate all amounts to
 * perMileAmount: amount to convert distance to expense
 * expenses: array of expense' ids - links to expenses collection in DB => ExpenseSchema in ./models/Expense.js
 * total: total of all expenes linked to this travel
 * useNestedStrict: TODO useNestedStrict description
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 */

const mongoose = require('mongoose');

const User = require('../models/User');
const Expense = require('../models/Expense');

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

/*
 * Helper method to update travel's total amount
 * Returns same document for which the total is calculated.
 * Before use you have to find document with populate expenses
 * EXAMPLE:
 * Travel
 * .findOne({_id: doc._id, _user: req.user.id})
 * .populate({path: 'expenses', populate: {path: 'curRate'}})
 * .then((doc) => {doc.updateTotal()}
 */
TravelSchema.methods.updateTotal = function  (cb) {
  this.total = 0;
  this.expenses.forEach((expense) => {
    this.total = Number(this.total) + Number(expense.amountConverted);
  });
  this.total = parseFloat(this.total).toFixed(2);
  return this.save();
}

TravelSchema.statics.byYear_byMonth = function (user, cb) {
  return this.aggregate([
{
  '$match': {
    '_user': user._id
  }
}, {
  '$sort': {
    'dateFrom': 1
  }
}, {
  '$group': {
    '_id': {
      'month': {
        '$month': '$dateFrom'
      },
      'year': {
        '$year': '$dateFrom'
      }
    },
    'byMonth': {
      '$push': '$$ROOT'
    },
    'count': {
      '$sum': 1
    },
    'dateFirst': {
      '$first': '$dateFrom'
    },
    'dateLast': {
      '$last': '$dateFrom'
    }
  }
},
{ $sort : { 'dateFirst' : 1} },
{
  '$group': {
    '_id': {
      'year': {
        '$year': '$dateFirst'
      }
    },
    'byYear': {
      '$push': '$$ROOT'
    },
    'count': {
      '$sum': 1
    },
    'countTotal': {$sum: "$count"},
    'dateFirst': {
      '$first': '$dateFirst'
    },
    'dateLast': {
      '$last': '$dateLast'
    }
  }
},
{ $sort : { 'dateFirst' : -1} }
]);
}

TravelSchema.statics.byMonth = function (user, cb) {
  return this.aggregate([
    {
      $match: {
          _user: user._id
        }
      },
      {
        $group: {
          _id: {
            month: {$month: "$dateFrom"},
            year: {$year: "$dateFrom"}
          },
          travels: {$addToSet: "$_id"},
          myArray: {'$push': '$$ROOT'},
          count: {$sum: 1},
          date: {$first: "$dateFrom"}
        }
      },
      {
        $project: {
          date: {$dateToString: {format: "%Y-%m",date: "$date"}},
          travels: '$travels',
          myArray: '$myArray',
          count: 1,
          _id: 0
        }
      }
    ]
  );
}

const Travel = mongoose.model('Travel', TravelSchema);

module.exports = Travel;
