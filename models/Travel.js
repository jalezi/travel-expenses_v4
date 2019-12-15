/* eslint-disable func-names */

const mongoose = require('mongoose');
const { addLogger } = require('../config/logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const { ObjectId } = mongoose.Schema.Types;

// Represents Travel mongoose document
const travelSchemaObject = {
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
};

// Travel Schema
const TravelSchema = new mongoose.Schema(travelSchemaObject, {
  useNestedStrict: true,
  timestamps: true
});

/*
 Helper method to update travel's total amount
 It's Travel document method.
 Returns same document for which the total is calculated.
 Before use you have to find document with populate expenses
 EXAMPLE:
 Travel
 .findOne({_id: doc._id, _user: req.user.id})
 .populate({path: 'expenses', populate: {path: 'curRate'}})
 .then((doc) => {doc.updateTotal()}
 */
TravelSchema.methods.updateTotal = function() {
  Logger.debug('updateTravel Schema methods');
  this.total = 0;
  this.expenses.forEach(expense => {
    this.total = Number(this.total) + Number(expense.amountConverted);
  });
  this.total = parseFloat(this.total).toFixed(2);
  return this.save();
};

/*
 Aggregate by year and inside year by month
 It's Travel model method
 Returns Travel model aggregation Travel.aggregate(Object[])
 */
TravelSchema.statics.byYear_byMonth = function (user) {
  Logger.debug('byYear_byMonth Schema statics');
  return this.aggregate([
    {
      $match: {
        _user: user._id
      }
    }, {
      $sort: {
        dateFrom: -1
      }
    }, {
      $lookup: {
        from: 'expenses',
        localField: 'expenses',
        foreignField: '_id',
        as: 'expenses'
      }
    }, {
      $lookup: {
        from: 'currencies',
        localField: 'expenses.curRate',
        foreignField: '_id',
        as: 'curRates'
      }
    }, {
      $group: {
        _id: {
          month: {
            $month: '$dateFrom'
          },
          year: {
            $year: '$dateFrom'
          }
        },
        byMonth: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        },
        dateFirst: {
          $first: '$dateFrom'
        },
        dateLast: {
          $last: '$dateFrom'
        }
      }
    },
    { $sort: { dateFirst: -1 } },
    {
      $group: {
        _id: {
          year: {
            $year: '$dateFirst'
          }
        },
        byYear: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        },
        countTotal: { $sum: '$count' },
        dateFirst: {
          $first: '$dateFirst'
        },
        dateLast: {
          $last: '$dateLast'
        }
      }
    },
    { $sort: { dateFirst: -1 } }
  ]);
};

/*
 Aggregate by month
 It's Travel model method
 Returns Travel model aggregation Travel.aggregate(Object[])
 */
TravelSchema.statics.byMonth = function (user) {
  Logger.debug('byMonth Schema statics');
  return this.aggregate([
    {
      $match: {
        _user: user._id
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$dateFrom' },
          year: { $year: '$dateFrom' }
        },
        travels: { $addToSet: '$_id' },
        myArray: { $push: '$$ROOT' },
        count: { $sum: 1 },
        date: { $first: '$dateFrom' }
      }
    },
    {
      $project: {
        date: { $dateToString: { format: '%Y-%m', date: '$date' } },
        travels: '$travels',
        myArray: '$myArray',
        count: 1,
        _id: 0
      }
    }
  ]);
};

// Travel model
const Travel = mongoose.model('Travel', TravelSchema);


module.exports = Travel;
