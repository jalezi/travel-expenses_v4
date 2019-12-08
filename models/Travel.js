/* eslint-disable func-names */

/**
 * @author Jaka Daneu
 * @fileoverview Defines mongoose {@link module:models/Travel~Travel Travel Model} based on
 * {@link module:models/Travel~Travel.TravelSchema Travel Schema}.
 * <p>{@link module:models/Travel Travel} module exports
 * {@link module:models/Travel~Travel Travel Model}</p>
 * @requires {@link https://www.npmjs.com/package/mongoose module:NPM:mongoose}
 * @requires config/logger.addLogger
 * @see {@link module:models/Travel Travel module}
 * @see {@link module:models/Travel~Travel Travel Model}
 * @see {@link module:models/Travel~Travel.TravelSchema Travel Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

/**
  * Defines mongoose {@link module:models/Travel~Travel Travel Model} based on
  * {@link module:models/Travel~Travel.TravelSchema Travel Schema}.
  * <p>{@link module:models/Travel Travel} module exports
  * {@link module:models/Travel~Travel Travel Model}</p>
  * @module
  * @example <caption> Example usage of Travel Model</caption>
  * const user = new User(); // see {@link module:models/User~User User Model}
  *
  * const travelObject = {
  *   _user: user._id,
  *   description: 'Game FC Barcelona vs Maccabi Tel Aviv',
  *   dateFrom: new Date('2019-11-07'),
  *   dateTo: new Date('2019-11-09'),
  *   homeCurrency: user.homeCurrency,
  *   perMileAmount: user.perMileAmount
  * };
  * const expense = new Travel(expenseObject);
  * expense.save();
  * @see {@link module:models/Travel~Travel Travel Model}
  * @see {@link module:models/Travel~Travel.TravelSchema Travel Schema}
  * <p></p>
  * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
  * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
  */

/** mongoose */
const mongoose = require('mongoose');
/** addLogger */
const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const { ObjectId } = mongoose.Schema.Types;

/**
 * @description Represents Travel mongoose document.
 * <p>Actual object for creating new mongoose Schema has more complex definition. See source!</p>
 * Mongoose {@link https://mongoosejs.com/docs/validation.html#validation Validation} is based on this object.
 * @type {Object}
 * @memberof module:models/Travel~Travel
 * @property {ObjectId} _user <b>required</b>, reference to user document
 * @property {String} description <b>required</b>, description of travel
 * @property {Date} dateFrom <b>required</b>, Travel starts on date
 * @property {Date} dateTo <b>required</b>, Travel ends on date
 * @property {String} homeCurrency Currency code to calculate expense's amount to
 * @property {Decimal128} [perMileAmount=0.00] per mile|kilometer value to convert
 * distance to amount
 * @property {ObjectId[]} expenses array with references to expense documents
 * @property {Decimal128} [total=0.00] Sum of all expenses' converted amounts
 */
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

/**
 * @description new mongoose.Schema(travelSchemaObject, {timestamps: true})
 * @type {mongoose.Schema}
 * @memberof module:models/Travel~Travel
 * @param (travelSchemaObject) travelSchemaObject
 * {@link module:models/Travel~Travel.travelSchemaObject travelSchemaObject}
 * @param {mongooseSchemaOptions} options {@link https://mongoosejs.com/docs/guide.html#options Schema Options}
 *
 * @see {@link module:models/Travel~Travel Travel Model}
 * @see {@link module:models/Travel~Travel.travelSchemaObject travelSchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const TravelSchema = new mongoose.Schema(travelSchemaObject, {
  useNestedStrict: true,
  timestamps: true
});

/**
 * Helper method to update travel's total amount
 * Returns same document for which the total is calculated.
 * Before use you have to find document with populate expenses
 * EXAMPLE:
 * Travel
 * .findOne({_id: doc._id, _user: req.user.id})
 * .populate({path: 'expenses', populate: {path: 'curRate'}})
 * .then((doc) => {doc.updateTotal()}
 */

/**
  * @description Updates travel's total
  * <p>It is Travel document method.</p>
  * @function updateTotal
  * @memberof module:models/Travel~Travel
  * @instance
  * @this module:models/Travel~Travel.TravelSchema
  * @returns travel document with updated total amount
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

/**
 * @description Some description
 * @function byYear_byMonth
 * @memberof module:models/Travel~Travel
 * @this module:models/Travel~Travel.TravelSchema
 * @param {User} user User
 * @returns Travel model aggregation Travel.aggregate(Object[])
 * @todo Add description
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

/**
 * @description Some description
 * @function byMonth
 * @memberof module:models/Travel~Travel
 * @this module:models/Travel~Travel.TravelSchema
 * @param {User} user User
 * @returns Travel model aggregation Travel.aggregate(Object[])
 * @todo Add description
 * @todo Why is this here?
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

/**
* <i>Mongoose new mongoose.Schema({...}, options) creates additional properties</i>:
 * <b>_id</b>, <b>__v</b>, <b>createdAt</b> and <b>updatedAt</b>, first two by default,
 * second two when passing {timesatmps: true} as second argument.
 * <br></br>
 * It's mongoose {@link https://mongoosejs.com/docs/models.html model} and
 * the instance is called {@link https://mongoosejs.com/docs/documents.html document}.
 * <p></p>
 * Models are fancy constructors compiled from Schema definitions.
 * An instance of a model is called a document.
 * Models are responsible for creating and reading documents from the underlying MongoDB database.
 * <p></p>
 * {@link https://mongoosejs.com/docs/validation.html#validation Validation} is based on
 * {@link module:models/Travel~Travel.travelSchemaObject travelSchemaObject}.
 * @constructor Travel
 * @classdesc Parameter {@link module:models/Travel~Travel.travelSchemaObject travelObject}
 * must compile based on {@link module:models/Travel~Travel.TravelSchema travelSchemaObject}.
 *
 * @param {travelObject} travelObject
 * {@link module:models/Travel~Travel.TravelSchema travelObject}
 * @example <caption> Example usage of Travel Model</caption>
 * const user = new User({...}); // see {@link module:models/User~User User Model}
 *
 * const travelObject = {
 *  _user: user._id,
 *  description: 'Game FC Barcelona vs Maccabi Tel Aviv',
 *  dateFrom: new Date('2019-11-07'),
 *  dateTo: new Date('2019-11-09'),
 *  homeCurrency: user.homeCurrency,
 *  perMileAmount: user.perMileAmount
 * };
 * const travel = new Travel(travelObject);
 * expense.save();
 * @see {@link module:models/Travel~Travel.TravelSchema Travel Schema}
 * @see {@link module:models/Travel~Travel.travelSchemaObject travelSchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const Travel = mongoose.model('Travel', TravelSchema);

/**
 * Travel model
 * @type {Model<Document, {}>}
 */
module.exports = Travel;
