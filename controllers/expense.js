/* eslint-disable quote-props */
const mongoose = require('mongoose');
const _ = require('lodash');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('expense');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\expense INITIALIZING!');

const { Expense, Travel } = require('../models');

const { ObjectId } = mongoose.Types;

const { expenseTypes } = require('../lib/globals');
const constants = require('../lib/constants');

const { reqAssertExpense, getCurRate } = require('./expenseMiddleware');

/**
 * Expense routes.
 * @module controllers/expense
 * @requires NPM:mongoose
 * @requires NPM:lodash
 * @requires NPM:moment
 * @requires module:config/LoggerClass
 * @requires module:models/Travel
 * @requires module:models/Expense
 * @requires module:models/Currency
 * @requires module:lib/globals
 * @requires module:lib/constants
 * @see {@link https://www.npmjs.com/package/mongoose NPM:mongoose}
 * @see {@link https://www.npmjs.com/package/lodash NPM:lodash}
 * @see {@link https://www.npmjs.com/package/moment NPM:moment}
 */

/**
 * GET /travels/:id/expenses/:id
 *
 * Get expense by id.
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.getExpense = (req, res, next) => {
  logger.debug('Getting expense');
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }
  let mileageType;
  const { expense } = res.locals;
  const { travel } = res.locals;
  const tDateFrom = travel.dateFrom;
  const tDateTo = travel.dateTo;

  if (expense.type !== 'Mileage') {
    const rate = Object.values(expense.curRate.rate)[0];
    expense.rate = rate.toFixed(2);
    mileageType = false;
  } else {
    expense.rate = travel.perMileAmount;
    mileageType = true;
  }

  res.render('expenses/expense', {
    title: 'Expense',
    travel,
    expense,
    mileageType,
    tDateFrom,
    tDateTo,
    constants,
    rates: JSON.stringify(res.locals.rates),
    expenseCurRate: JSON.stringify(expense.curRate),
    expenseTypes
  });
};

/**
 * DELETE /travels/:id/expenses/:id
 *
 * Delete expense with id.
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.deleteExpense = async (req, res, next) => {
  logger.debug('Deleting expense');
  const expenseId = req.params.id;
  const { travel } = res.locals;
  const { expense } = res.locals;
  Expense.findOneAndDelete({ _id: expenseId, travel: travel._id })
    .then(() => {
      Travel.findByIdAndUpdate(
        travel._id,
        {
          $pullAll: { expenses: [expenseId] },
          $inc: { total: -expense.amountConverted }
        },
        err => {
          if (!err) {
            return next(err);
          }
        }
      );
    })
    .then(() => {
      req.flash('info', { msg: 'Expense successfully deleted!!' });
      res.redirect(`/travels/${travel._id}`);
    })
    .catch(err => {
      next(err);
    });
};

/**
 * PATCH /travels/:id/expenses/:id
 *
 * Update(PATCH) expense with id.
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.updateExpense = async (req, res, next) => {
  logger.debug('Updating expense');
  const { travel } = res.locals;
  const { expense } = res.locals;

  const errors = reqAssertExpense(req, res);

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${travel._id}`);
  }

  const body = _.pick(req.body, [
    'expenseType',
    'expenseDescription',
    'invoiceDate',
    'amountDistance',
    'amountDistance2',
    'amountConverted',
    'amountConverted2',
    'invoiceCurrency',
    'rate',
    'amount'
  ]);
  const invoiceDate = new Date(req.body.invoiceDate);
  travel.total = (
    travel.total -
    Number(expense.amountConverted) +
    Number(body.amountConverted) +
    Number(body.amountConverted2)
  ).toFixed(2);

  expense.type = body.expenseType;
  expense.description = body.expenseDescription;
  expense.date = invoiceDate;

  // Different data if expense type is Mileage
  if (req.body.expenseType !== 'Mileage') {
    const curRate = await getCurRate(req, res, next);

    expense.unit = undefined;
    expense.currency = body.invoiceCurrency.toUpperCase();
    expense.curRate = curRate;
    expense.amount = body.amount;
    expense.amountConverted = body.amountConverted;
  } else {
    expense.unit = req.user.homeDistance;
    expense.currency = undefined;
    expense.curRate = undefined;
    expense.amount = body.amountDistance;
    expense.amountConverted = body.amountConverted2;
  }


  await expense
    .save()
    .then(() => {
      travel
        .save()
        .then(() => {
          req.flash('info', { msg: 'Expense successfully updated!' });
          logger.debug({ expense });
          logger.debug('Updating expense END - redirect');
          res.redirect(`/travels/${travel._id}`);
        })
        .catch(err => {
          logger.error(err);
          logger.debug('Updating expense END - next(err');
          next(err);
        });
    })
    .catch(err => {
      logger.error(err);
      logger.debug('Updating expense END - catch - next(err');
      next(err);
    });
};

/**
 * POST /travels/:id/expenses/new
 *
 * Post new expense.
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.postNewExpense = async (req, res, next) => {
  logger.debug('Creating new expense');

  const errors = reqAssertExpense(req, res);

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${req.params.id}`);
  }

  let expense = {};
  const invoiceDate = new Date(req.body.invoiceDate);

  const expenseObject = {
    travel: req.params.id,
    type: req.body.expenseType,
    description: req.body.expenseDescription,
    date: invoiceDate,
    _user: req.user._id
  };

  // Different data if expense type is Mileage
  if (req.body.expenseType !== 'Mileage') {
    const curRate = await getCurRate(req, res, next);

    expenseObject.currency = req.body.invoiceCurrency.toUpperCase();
    expenseObject.curRate = curRate;
    expenseObject.amount = req.body.amount;
    expenseObject.amountConverted = req.body.amountConverted;
  } else {
    expenseObject.unit = req.user.homeDistance;
    expenseObject.amount = req.body.amountDistance;
    expenseObject.amountConverted = req.body.amountConverted2;
  }
  expense = new Expense(expenseObject);

  try {
    const doc = await expense.save();
    const travel = await Travel.findByIdAndUpdate(
      res.locals.travel._id,
      { $addToSet: { expenses: doc._id } },
      err => {
        if (err) {
          logger.error(err);
          logger.debug('Creating new expense END - return next err');
          return next(err);
        }
      }
    );
    const result = Number(travel.total) + Number(doc.amountConverted);
    travel.total = result.toFixed(2);
    travel.save();
  } catch (err) {
    logger.error('Creating new expense END - catch return next err');
    return next(err);
  }

  logger.debug({ expense });
  logger.debug('Creating new expense END - redirect');
  req.flash('success', { msg: 'Successfully added new expense!' });
  res.redirect(`/travels/${req.params.id}`);
};
