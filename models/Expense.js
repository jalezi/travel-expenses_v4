/* eslint-disable max-len */
/**
 * @author Jaka Daneu
 * @fileoverview Defines mongoose {@link module:models/Expense~Expense Expense Model} based on
 * {@link module:models/Expense~Expense.ExpenseSchema Expense Schema}.
 * <p>{@link module:models/Expense Expense} module exports
 * {@link module:models/Expense~Expense Expense Model}</p>
 * @requires {@link https://www.npmjs.com/package/mongoose module:NPM mongoose}
 * @requires {@link module:config/logger module:config/logger.addLogger}
 * @see {@link module:models/Expense Expense module}
 * @see {@link module:models/Expense~Expense Expense Model}
 * @see {@link module:models/Expense~Expense.ExpenseSchema Expense Schema}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */

/**
  * Defines mongoose {@link module:models/Expense~Expense Expense Model} based on
  * {@link module:models/Expense~Expense.ExpenseSchema Expense Schema}.
  * <p>{@link module:models/Expense Expense} module exports
  * {@link module:models/Expense~Expense Expense Model}</p>
  * @module
  * @example <caption> Example usage of Expense Model</caption>
  * const { ObjectId } = mongoose.Schema.Types;
  * const user = new User({...}); // see {@link module:models/User~User User Model}
  * const travel = new Travel({...}); // see {@link module:models/Travel~Travel Travel Model}
  * const currency = new Currency({...}); // see * {@link module:models/Currency~Currency Currency Model}
  *
  * const expenseObject = {
  *   travel: travel._id, // link to travel
  *   type: 'Flight',
  *   description: 'Tel Aviv - Barcelona - Tel Aviv',
  *   date: new Date('2019-11-07'),
  *   currency: 'EUR',
  *   curRate: currency._id, // link to currency
  *   amount: 89,
  *   amountConverted: 100,
  *   _user: user._id // link to user
  * };
  * const expense = new Expense(expenseObject);
  * expense.save();
  * @see {@link module:models/Expense~Expense Expense Model}
  * @see {@link module:models/Expense~Expense.ExpenseSchema Expense Schema}
  * <p></p>
  * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
  * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
  */

const mongoose = require('mongoose');

// const { addLogger } = require('../config/logger');

// const pathDepth = module.paths.length - 6;
// const Logger = addLogger(__filename, pathDepth);

const { ObjectId } = mongoose.Schema.Types;

/**
 * @description Represents Expense mongoose document.
 * <p>Actual object for creating new mongoose Schema has more complex definition. See source!</p>
 * Mongoose {@link https://mongoosejs.com/docs/validation.html#validation Validation} is based on this object.
 * @type {Object}
 * @memberof module:models/Expense~Expense
 * @property {ObjectId} travel <b>required</b>, reference to travel document
 * @property {String} type <b>required</b>, type of expense: "Flight", "Mileage", "Meal", etc.
 * @property {String} description <b>required</b>, description of expense
 * @property {Date} date <b>required</b>, date of expense
 * @property {String} [currency] international currency code; length 3, capital letters
 * @property {ObjectId} [curRate] reference to currency document
 * @property {String} [unit] if type of expense is Mileage
 * @property {Decimal128} [amount] amount of expense in local currency
 * @property {Decimal128} [amountConverted=0] amount of expense in user home currency
 * @property {ObjectId} _user <b>required</b>, reference to user document
 * @todo Set default value for amount
 * @todo Set currency default value and add validation for currency property
 * @todo Check if you can make curRate required
 * @todo Check if you can make amount required or set default value
 *
 */
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

/**
 * @description new mongoose.Schema(expenseSchemaObject, {timestamps: true})
 * @type {mongoose.Schema}
 * @memberof module:models/Expense~Expense
 * @param (expenseSchemaObject) expenseSchemaObject
 * {@link module:models/Expense~Expense.expenseSchemaObject expenseSchemaObject}
 * @param {mongooseSchemaOptions} options {@link https://mongoosejs.com/docs/guide.html#options Schema Options}
 *
 * @see {@link module:models/Expense~Expense Expense Model}
 * @see {@link module:models/Expense~Expense.expenseSchemaObject expenseSchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 * @todo implement currency validation => length=3 & make upper case
 * @todo check if you can implement validation for optional params
 */
const ExpenseSchema = new mongoose.Schema(
  expenseSchemaObject,
  { timestamps: true }
);

/**
 * <i><u>expenseObject</u></i> has 10 properties:
 * <p><b>travel</b> - reference to travel document</p>
 * <p><b>type</b> - what kind of expense</p>
 * <p><b>description</b> - expense description</p>
 * <p><b>date</b> - when expense was made</p>
 * <p><b>currency</b> - in which currency was invoice</p>
 * <p><b>curRate</b> - reference to currency document</p>
 * <p><b>unit</b> - only if the property 'type' is 'Mileage' km or mile</p>
 * <p><b>amount</b> - amount on invoice</p>
 * <p><b>amount converted</b> - amount converted to user currency</p>
 * <p><b>_user</b> - reference to user document</p>
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
 * {@link module:models/Expense~Expense.expenseSchemaObject expenseSchemaObject}.
 * @constructor Expense
 * @classdesc Parameter {@link module:models/Expense~Expense.expenseSchemaObject expenseObject}
 * must compile based on {@link module:models/Expense~Expense.ExpenseSchema expenseSchemaObject}.
 *
 * @param {expenseObject} expenseObject
 * {@link module:models/Expense~Expense.ExpenseSchema expenseObject}
 * @example <caption> Example usage of Expense Model</caption>
 * const { ObjectId } = mongoose.Schema.Types;
 * const user = new User({...}); // see {@link module:models/User~User User Model}
 * const travel = new Travel({...}); // see {@link module:models/Travel~Travel Travel Model}
 * const currency = new Currency({...}); // see {@link module:models/Currency~Currency Currency Model}
 *
 * const expenseObject = {
 *   travel: travel._id, // link to travel
 *   type: 'Flight',
 *   description: 'Tel Aviv - Barcelona - Tel Aviv',
 *   date: new Date('2019-11-07'),
 *   currency: 'EUR',
 *   curRate: currency._id, // link to currency
 *   amount: 89,
 *   amountConverted: 100,
 *   _user: user._id // link to user
 * };
 * const expense = new Expense(expenseObject);
 * expense.save();
 * @see {@link module:models/Expense~Expense.ExpenseSchema Expense Schema}
 * @see {@link module:models/Expense~Expense.expenseSchemaObject expenseSchemaObject}
 * <p></p>
 * @see {@link https://mongoosejs.com/docs/models.html mongoose Models}
 * @see {@link https://mongoosejs.com/docs/guide.html mongoose Schemas}
 */
const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
