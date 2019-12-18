/* eslint-disable func-names */
/* eslint-disable no-multi-assign */
/* eslint-disable quote-props */
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('travel');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\travel INITIALIZING!');

const { Expense, Travel, User } = require('../models');

const { ObjectId } = mongoose.Types;

const { expenseTypes } = require('../lib/globals');
const constants = require('../lib/constants');

const updateExpensesToMatchTravelRangeDates = require('../utils/updateExpensesToMatchTravelRangeDates');

const travelExpensesToPDF = require('../utils/travelExpensesToPDF');
const travelsTotalToPDF = require('../utils/travelsTotalToPDF');

const { currencyOptions } = require('./utils');

/**
 * Travel routes.
 * @module controllers/travel
 * @requires NPM:mongoose
 * @requires NPM:lodash
 * @requires NPM:moment
 * @requires module:models/User
 * @requires module:models/Travel
 * @requires module:models/Expense
 * @requires module:lib/globals
 * @requires module:lib/constants
 * @requires module:utils/updateExpensesToMatchTravelRangeDates
 * @see {@link https://www.npmjs.com/package/mongoose NPM:mongoose}
 * @see {@link https://www.npmjs.com/package/lodash NPM:lodash}
 * @see {@link https://www.npmjs.com/package/moment NPM:moment}
 */

/**
 * GET /travels/total_pdf
 *
 * Create, open in new tab and save PDF file for filtered travels
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.getTravelsTotalPDF = async function (req, res, next) {
  logger.debug('Middleware getTravelsTotalPDF');
  // Create and open PDF
  function createTravelsTotalPDF(res, travels, user, dateRange, sum, indexes) {
    const stream = travelsTotalToPDF(travels, user, dateRange, sum, indexes);
    let filename = `TOTAL_${user._id}_${dateRange.df}_${dateRange.dt}.pdf`; // Be careful of special characters
    filename = encodeURIComponent(filename); // Ideally this should strip them
    res.setHeader('Content-disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');
    stream.pipe(res);
  }

  let travels;
  let queryDateFrom;
  let queryDateTo;
  // Get date range from url query
  const { df } = req.query;
  const { dt } = req.query;
  const dateRange = { df, dt };
  const indexes = [];
  const travelIndexesArray = await User.aggregate(
    [
      {
        $project: {
          travels: 1
        }
      },
      {
        $match: {
          _id: req.user._id
        }
      }
    ],
    () => {
      // console.log(docs);
    }
  );
  const travelIndexes = travelIndexesArray[0].travels;
  // if statement is safety in case date range is not passed as url query
  if (df === '' || dt === '') {
    travels = await Travel.find({ _user: res.locals.user._id });
    Travel.aggregate(
      [
        { $match: { _user: res.locals.user._id } },
        { $group: { _id: null, sum: { $sum: '$total' } } }
      ],
      (err, result) => {
        if (err) {
          next(err);
        } else {
          let sum;
          if (result.length === 0) {
            sum = 0;
          } else {
            sum = Number(result[0].sum);
          }
          createTravelsTotalPDF(
            res,
            travels,
            res.locals.user,
            dateRange,
            sum,
            indexes
          );
        }
      }
    );
  } else {
    queryDateFrom = new Date(df);
    queryDateTo = new Date(dt);
    travels = await Travel.find({
      _user: res.locals.user._id,
      $and: [
        { dateFrom: { $gte: queryDateFrom } },
        { dateFrom: { $lte: queryDateTo } }
      ]
    });
    Travel.aggregate(
      [
        {
          $match: {
            _user: res.locals.user._id,
            $and: [
              { dateFrom: { $gte: queryDateFrom } },
              { dateFrom: { $lte: queryDateTo } }
            ]
          }
        },
        { $group: { _id: null, sum: { $sum: '$total' } } }
      ],
      (err, result) => {
        if (err) {
          next(err);
        } else {
          let sum;
          if (result.length === 0) {
            sum = 0;
          } else {
            sum = Number(result[0].sum);
          }
          // console.log(typeof x);
          // console.log(travelIndexes);
          // console.log(typeof travelIndexes[63]);
          travels.forEach(item => {
            travelIndexes.forEach((item, idx, object) => {
              object[idx] = item.toString();
            });
            const matchIndex = travelIndexes.indexOf(item._id.toString()) + 1;
            indexes.push(matchIndex);
          });
          createTravelsTotalPDF(
            res,
            travels,
            res.locals.user,
            dateRange,
            sum,
            indexes
          );
        }
      }
    );
  }
};

/**
 * GET /travels/:id/pdf
 *
 * Create, open in new tab and save PDF for displayed travel
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.getTravelExpensesPDF = async function (req, res) {
  logger.debug('MIddleware getTravelExpensesPDF');
  const invoiceNumberArray = await User.aggregate([
    {
      $project: {
        index: {
          $indexOfArray: ['$travels', new ObjectId(res.locals.travel._id)]
        }
      }
    },
    {
      $match: {
        _id: new ObjectId(req.user._id)
      }
    }
  ]);
  const idx = invoiceNumberArray[0].index + 1;
  console.log(idx);
  const stream = travelExpensesToPDF(res.locals.travel, req.user, idx);
  let filename = `TReport_${req.user._id}_${res.locals.travel._id}_${idx}.pdf`; // Be careful of special characters
  filename = encodeURIComponent(filename); // Ideally this should strip them
  res.setHeader('Content-disposition', `inline; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  stream.pipe(res);
};

/**
 * GET /travels
 *
 * All travels
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.getTravels = async function (req, res, next) {
  logger.debug('Getting travels');
  // let filter;
  // let sortBy;
  let searchMinDate;
  let searchMaxDate;
  let minDate;
  let maxDate;
  let yearMin;
  let yearMax;
  let years = [];
  let { filter } = req.query;
  if (!filter) {
    filter = 'All';
  }
  let { sortBy } = req.query;
  if (!sortBy) {
    sortBy = '-dateFrom';
  }
  searchMinDate = req.query.minDate;
  searchMaxDate = req.query.maxDate;

  try {
    await Travel.aggregate(
      [
        { $match: { _user: req.user._id, _id: { $in: req.user.travels } } },
        {
          $group: {
            _id: req.user._id,
            minDate: { $min: '$dateFrom' },
            maxDate: { $max: '$dateFrom' }
          }
        }
      ],
      (err, doc) => {
        if (err) {
          next(err);
        }
        if (doc.length !== 0) {
          minDate = moment(doc[0].minDate).format('YYYY-MM-DD');
          maxDate = moment(doc[0].maxDate).format('YYYY-MM-DD');
          yearMin = moment(doc[0].minDate).format('YYYY');
          yearMax = moment().format('YYYY');
          for (let i = Number(yearMax); i >= Number(yearMin); i--) {
            years.push(i);
          }
        } else {
          minDate = maxDate = moment().format('YYYY-MM-DD');
          yearMin = yearMax = moment().format('YYYY');
          years = [yearMin];
        }

        if (!searchMinDate) {
          searchMinDate = minDate;
        }
        if (!searchMaxDate) {
          searchMaxDate = maxDate;
        }

        Travel.find({
          _id: { $in: req.user.travels },
          $and: [
            { dateFrom: { $gte: new Date(searchMinDate) } },
            { dateFrom: { $lte: new Date(searchMaxDate) } }
          ]
        })
          .sort(sortBy)
          .then(docs => {
            const travels = docs;
            res.render('travels/travels', {
              title: 'Travels',
              travels,
              filter,
              searchMinDate,
              searchMaxDate,
              years
            });
          });
      }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /travels/new
 * Form to post new travel
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.getNewTravel = async function (req, res) {
  logger.debug('Getting new travel');
  res.render('travels/new', {
    title: 'New travel',
    user: req.user
  });
};

/**
 * POST /travels/new
 *
 * Create new travel based on user input
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.postNewTravel = async function (req, res, next) {
  logger.debug('Posting new travel');
  req
    .assert(
      'description',
      'Description is empty or to long (max 60 characters)!'
    )
    .isLength({ min: 1, max: 60 });
  req
    .assert('homeCurrency', 'Home currency should have exactly 3 characters!')
    .isLength({ min: 3, max: 3 });

  const decimalOptions = { decimal_digits: 2 };
  req
    .assert(
      'perMileAmount',
      'Per mile amount should be positive number with 2 decimals!'
    )
    .isDecimal(decimalOptions);

  const dateCompare = moment(req.body.dateTo)
    .add(1, 'days')
    .format('YYYY-MM-DD');
  req
    .assert('dateFrom', 'Date from should be before date to')
    .isBefore(dateCompare);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/travels/new');
  }

  const dateFrom = new Date(req.body.dateFrom);
  const dateTo = new Date(req.body.dateTo);
  const travel = new Travel({
    _user: req.user._id,
    description: req.body.description.replace(/\s+/g, ' ').trim(),
    dateFrom,
    dateTo,
    homeCurrency: req.body.homeCurrency,
    perMileAmount: req.body.perMileAmount
  });

  try {
    const doc = await travel.save();
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { travels: doc._id } },
      err => {
        if (err) {
          return next(err);
        }
      }
    );
  } catch (err) {
    return next(err);
  }

  req.flash('success', { msg: 'Successfully added new travel!' });
  res.redirect('/travels');
};

/**
 * GET /travels/:id
 *
 * Show  travel
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.getTravel = async function (req, res, next) {
  logger.debug('Getting single travel');
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }
  const { travel } = res.locals;

  if (!travel) {
    return next(new Error('Travel not found'));
  }

  try {
    const { expenses } = travel;

    expenses.forEach(expense => {
      if (expense.type !== 'Mileage') {
        const rate = Object.values(expense.curRate.rate)[0];
        expense.rate = rate.toFixed(2);
      } else {
        expense.rate = travel.perMileAmount;
      }
    });


    res.render('travels/travel', {
      title: 'Travel',
      travel,
      expenses,
      expenseTypes,
      constants,
      rates: JSON.stringify(res.locals.rates)
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * DELETE /travels/:id
 *
 * Delete chosen/displayed travel
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.deleteTravel = async function (req, res, next) {
  logger.debug('Deleting single travel');
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  try {
    const travel = await Travel.findOneAndDelete({
      _id: id,
      _user: req.user._id
    });

    if (!travel) {
      req.flash('error', { msg: 'Travel not found!!' });
      return next(new Error('Travel not found'));
    }

    Expense.deleteMany({ travel: travel._id, _user: req.user._id }, err => {
      if (err) {
        return next(err);
      }
    });

    User.findByIdAndUpdate(
      req.user._id,
      { $pullAll: { travels: [travel._id] } },
      err => {
        if (!err) {
          return next(err);
        }
      }
    );
    req.flash('info', { msg: 'Travel successfully deleted!' });
    res.redirect('/travels');
  } catch (err) {
    return next(err);
  }
};

/**
 * PATCH /travels/new
 *
 * Update travel information
 * If travel's expenses dates are not within travel date range,
 * update expenses and recalculate travel total
 * @async
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.updateTravel = async function (req, res, next) {
  logger.debug('Updating(PATCH) single travel');

  req
    .assert(
      'description',
      'Description is empty or to long (max 120 characters)!'
    )
    .isLength({ min: 1, max: 60 });
  req
    .assert('homeCurrency', 'Home currency should have exactly 3 characters!')
    .isLength({ min: 3, max: 3 });
  req
    .assert(
      'perMileAmount',
      'Per mile amount should be positive number with 2 decimals!'
    )
    .isNumeric()
    .isCurrency(currencyOptions);

  const dateCompare = moment(req.body.dateTo)
    .add(1, 'days')
    .format('YYYY-MM-DD');
  req
    .assert('dateFrom', 'Date from should be before date to')
    .isBefore(dateCompare);

  const errors = req.validationErrors();
  const { id } = req.params;

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${id}`);
  }

  // Get data from html form to update travel
  const body = _.pick(req.body, [
    'description',
    'dateFrom',
    'dateTo',
    'homeCurrency',
    'perMileAmount'
  ]);

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  try {
    // Update travel with new data
    const travel = await Travel.findOneAndUpdate(
      { _id: id, _user: req.user.id },
      { $set: body },
      { new: true }
    ).populate({ path: 'expenses', populate: { path: 'curRate' } });

    if (!travel) {
      return next(new Error('Travel not found'));
    }
    /**
     * Check expenses dates and set them within travel dates.
     * Calculate travel total. New expenses date, new rate.
     * Rates for same currency are not the same for different dates.
     */
    updateExpensesToMatchTravelRangeDates(travel).then(() => {
      travel.save().then(doc => {
        Travel.findOne({ _id: doc._id, _user: req.user.id })
          .populate({ path: 'expenses', populate: { path: 'curRate' } })
          .then(doc => {
            doc.updateTotal().then(() => {
              req.flash('success', { msg: 'Travel successfully updated!' });
              res.redirect('/travels');
            });
          });
      });
    });
  } catch (err) {
    return next(err);
  }
};
