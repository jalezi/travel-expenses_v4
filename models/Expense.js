/**
 * @fileoverview Defines mongoose {@link module:models/Expense~Expense Expense Model} based on
 * {@link module:models/Expense~ExpenseSchema Expense Schema}.
 * <p>{@link module:models/Expense Expense} module exports {@link module:models/Expense~Expense Expense Model}</p>
 * @example <caption> Example usage of Expense Model</caption>
 * const { ObjectId } = mongoose.Schema.Types;
 * const user = new User(); // see User Model
 * const travel = new Travel(); // see Travel Model
 * const currency = new Currency(); // see {@link module:models/Currency~Currency Currency Model}
 * 
 * const expenseObject = {
 * travel: travel._id, // link to travel
 * type: 'Flight',
 * description: 'Barcelona - Madrid - Barcelona',
 * date: new Date('2019-11-07'),
 * currency: 'EUR',
 * curRate: currency._id, // link to currency
 * amount: 89,
 * amountConverted: 100,
 * _user: user._id // link to user
 * };
 * @see {@link module:models/Expense Expense Module}
 * @see {@link module:models/Expense~Expense Expense Model}
 * @see {@link module:models/Expense~ExpenseSchema Expense Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

 /**
  * Defines mongoose {@link module:models/Expense~Expense Expense Model} based on
  * {@link module:models/Expense~ExpenseSchema Expense Schema}.
  * <p>{@link module:models/Expense Expense} module exports {@link module:models/Expense~Expense Expense Model}</p>
  * @module
  * @example <caption> Example usage of Expense Model</caption>
  * const { ObjectId } = mongoose.Schema.Types;
  * const user = new User(); // see User Model
  * const travel = new Travel(); // see Travel Model
  * const currency = new Currency(); // see {@link module:models/Currency~Currency Currency Model}
  * 
  * const expenseObject = {
  * travel: travel._id, // link to travel
  * type: 'Flight',
  * description: 'Barcelona - Madrid - Barcelona',
  * date: new Date('2019-11-07'),
  * currency: 'EUR',
  * curRate: currency._id, // link to currency
  * amount: 89,
  * amountConverted: 100,
  * _user: user._id // link to user
  * };
  * @see {@link module:models/Expense~Expense Expense Model}
  * @see {@link module:models/Expense~ExpenseSchema Expense Schema}
  * <p></p>
  * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
  * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
  */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

/**
 * @type {mongoose.Schema}
 * @property {ObjectId} travel link to travel => travel._id from travels collection
 * @property {String} type possible expense type => ./lib/globals.expenseTypes
 * @property {String} description expense description
 * @property {Date} date expense date
 * @property {String} currency invoice currency 
 * @property {ObjectId} curRate link to currency => currency._id from currencies collection
 * @property {String} unit only if expense type is Mileage based on user's unit(user.homeDistance) =>
 *  userSchema in ./models/User.js
 * @property {mongoose.Decimal128} amount amount spent in local currency or distance in unit
 * @property {mongoose.Decimal128} amountConverted converted amount based on user's currency(homeCurrency) or
 *  user's per distance conversion(user.perMileAmount) => userSchema in ./models/User.js
 * @property {ObjectId} _user link to user => user._id from users collection
 * @property {Date} createdAt created with Mongoose Schema option {timestamps: true}
 * @property {Date} updatedAt reated with Mongoose Schema option {timestamps: true}
 * @see {@link module:models/Expense~Expense Expense Model}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 * @todo implement currency validation => length=3 & make upper case
 */
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
    default: 0.00
  },
  _user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

/**
 * This is Constructor Expense Model description
 * @constructor Expense
 * @classdesc This is Class Expense Model description
 * @param {mongoose.Schema} ExpenseSchema {@link module:models/Expense~ExpenseSchema Expense Schema}
 * @example <caption> Example usage of Expense Model</caption>
 * const { ObjectId } = mongoose.Schema.Types;
 * const user = new User(); // see User Model
 * const travel = new Travel(); // see Travel Model
 * const currency = new Currency(); // see {@link module:models/Currency~Currency Currency Model}
 * 
 * const expenseObject = {
 * travel: travel._id, // link to travel
 * type: 'Flight',
 * description: 'Barcelona - Madrid - Barcelona',
 * date: new Date('2019-11-07'),
 * currency: 'EUR',
 * curRate: currency._id, // link to currency
 * amount: 89,
 * amountConverted: 100,
 * _user: user._id // link to user
 * };
 * @see {@link module:models/Expense~ExpenseSchema Expense Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
