const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const Papa = require('papaparse');

const User = require('../models/User');
const Travel = require('../models/Travel');
const Expense = require('../models/Expense');
const Rate = require('../models/Rate');
const ObjectId = mongoose.Types.ObjectId;

const {expenseTypes} = require('../lib/globals');
const constants = require('../lib/constants');

const updateExpensesToMatchTravelRangeDates = require('../utils/updateExpensesToMatchTravelRangeDates');

const travelExpensesToPDF = require('../utils/travelExpensesToPDF');
const travelsTotalToPDF = require('../utils/travelsTotalToPDF');

/*
 * GET /travels/total_pdf
 * Create, open in new tab and save PDF file for filtered travels
 */
exports.getTravelsTotalPDF = async function(req, res, next) {
// Create and open PDF
  function createTravelsTotalPDF(res, travels, user, dateRange, sum) {
    const stream = travelsTotalToPDF(travels, user, dateRange, sum);
    let filename = `TOTAL_${user._id}_${df}_${dt}.pdf`;  // Be careful of special characters
    filename = encodeURIComponent(filename);  // Ideally this should strip them
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    stream.pipe(res);
  }

  let travels, queryDateFrom, queryDateTo, totalSum;
  // Get date range from url query
  const df = req.query.df;
  const dt = req.query.dt;
  const dateRange = {df, dt};

  // if statement is safety in case date range is not passed as url query
  if (df === '' || dt === '') {
    travels = await Travel.find({_user: res.locals.user._id});
    totalSum = Travel.aggregate([
      {'$match': {'_user': res.locals.user._id}},
      {'$group': {'_id': null, 'sum': {'$sum': '$total'}}}
    ], (err, result) => {
    if (err) {next(err)
    } else {
      let sum;
      if (result.length === 0) {sum = 0;} else {sum = Number(result[0].sum);}
      createTravelsTotalPDF(res, travels, res.locals.user, dateRange, sum);
    }
});
  } else {
    queryDateFrom = new Date(df);
    queryDateTo = new Date(dt);
    travels = await Travel.find({
      _user: res.locals.user._id,
      $and: [{dateFrom: {$gte: queryDateFrom}}, {dateFrom: {$lte: queryDateTo}}]
    });
    totalSum = Travel.aggregate([
      {'$match': {'_user': res.locals.user._id, $and: [{dateFrom: {$gte: queryDateFrom}}, {dateFrom: {$lte: queryDateTo}}]}},
      {'$group': {'_id': null, 'sum': {'$sum': '$total'}}}
], (err, result) => {
  if (err) {
    next(err)
  } else {
    let sum;
    if (result.length === 0) {sum = 0;} else {sum = Number(result[0].sum);}
    createTravelsTotalPDF(res, travels, res.locals.user, dateRange, sum);
  }
});}}

/*
 * GET /travels/:id/pdf
 * Create, open in new tab and save PDF for displayed travel
 */
exports.getTravelExpensesPDF = async function(req, res, next) {
  const stream = travelExpensesToPDF(res.locals.travel, res.locals.user);
  let filename = "travelReportDocument.pdf";  // Be careful of special characters
  filename = encodeURIComponent(filename);  // Ideally this should strip them
  res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');
  stream.pipe(res);
}

/*
 * GET /travels
 * All travels
 */
exports.getTravels = async function(req, res) {
  let filter, sortBy, searchMinDate, searchMaxDate, minDate, maxDate, yearMin, yearMax, years = [];
  filter = req.query.filter;
  if (!filter) {
    filter = 'All';
  }
  sortBy = req.query.sortBy;
  if (!sortBy) {
    sortBy = '-dateFrom';
  }
  searchMinDate = req.query.minDate;
  searchMaxDate = req.query.maxDate;


  // TODO create new Promise?
  try {
    await Travel.aggregate([
      {'$match': {'_user': req.user._id}},
      {'$group': {'_id': req.user._id,'minDate': {'$min': '$dateFrom'}, 'maxDate': {'$max': '$dateFrom'}}}
  ], (err, doc) => {
    if (err) {next(err);}
    if (doc.length != 0) {
      minDate = moment(doc[0].minDate).format('YYYY-MM-DD');
      maxDate = moment(doc[0].maxDate).format('YYYY-MM-DD');
      yearMin = moment(doc[0].minDate).format('YYYY');
      yearMax = moment().format('YYYY');
      for (i = Number(yearMax); i >= Number(yearMin); i--) {years.push(i);}
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

    Travel.find({_id: {$in: req.user.travels}, $and: [{dateFrom: {$gte: new Date(searchMinDate)}}, {dateFrom: {$lte: new Date(searchMaxDate)}}]}).sort(sortBy)
    .then((docs) => {
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

  });
} catch (err) {
  next(err)
  }
}

/*
 * GET /travels/new
 * Form to post new travel
 */
exports.getNewTravel = async function(req, res) {
  res.render('travels/new', {
    title: 'New travel',
    user: req.user
  });
}

/*
 * POST /travels/new
 * Create new travel based on user input
 */
exports.postNewTravel = async function(req, res, next) {

  req.assert('description', 'Description is empty or to long (max 60 characters)!').isLength({min: 1, max: 60});
  req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({min: 3,max: 3});

  const decimalOptions = {decimal_digits: 2};
  req.assert('perMileAmount', 'Per mile amount should be positive number with 2 decimals!').isDecimal(decimalOptions);

  const dateCompare = moment(req.body.dateTo).add(1, 'days').format('YYYY-MM-DD');
  req.assert('dateFrom', 'Date from should be before date to').isBefore(dateCompare);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/travels/new');
  }

  const dateFrom = new Date(req.body.dateFrom);
  const dateTo = new Date(req.body.dateTo);
  const travel = new Travel({
    _user: req.user._id,
    description: req.body.description.replace(/\s+/g, " ").trim(),
    dateFrom,
    dateTo,
    homeCurrency: req.body.homeCurrency,
    perMileAmount: req.body.perMileAmount
  });

  try {
    const doc = await travel.save();
    await User.findByIdAndUpdate(req.user._id, {$addToSet: {'travels': doc._id}}, (err, user) => {if (err) {return next(err);}});
  } catch (err) {return next(err);}

  req.flash('success', {msg: 'Successfully added new travel!'});
  res.redirect('/travels');
}

/*
 * GET /travels/:id
 * Show choosen travel
 */
exports.getTravel = async function(req, res, next) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {  return next(new Error('Not valid Object Id'));}
  const travel = res.locals.travel;

  try {
    const expenses = travel.expenses;

    expenses.forEach((expense, index, arr) => {
      if (expense.type != 'Mileage') {
        const rate = Object.values(expense.curRate.rate)[0];
        expense.rate = rate.toFixed(2);
      } else {expense.rate = travel.perMileAmount;}
    });

    if (!travel) {return next(new Error('Travel not found'))}

    res.render('travels/travel', {
      title: 'Travel',
      travel,
      expenses,
      expenseTypes,
      constants,
      rates: JSON.stringify(res.locals.rates)
    });
  } catch (err) {return next(err);}
};

/*
 * DELETE /travels/:id
 * Delete chosen/displayed travel
 */
exports.deleteTravel = async function(req, res, next) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {return next(new Error('Not valid Object Id'));}

  try {
    const travel = await Travel.findOneAndDelete({_id: id, _user: req.user._id});

    if (!travel) {
      req.flash('error', {msg: 'Travel not found!!'});
      return next(new Error('Travel not found'));
    }

    Expense.deleteMany({travel: travel._id, _user: req.user._id}, (err) => {
      if (err) {return next(err)}
    });

    User.findByIdAndUpdate(req.user._id, {$pullAll: {'travels': [travel._id]}}, (err, user) => {
      if (!err) {return next(err);}
    });
    req.flash('success', {msg: 'Travel successfully deleted!'});
    res.redirect('/travels');
  } catch (err) {return next(err);}
};

/*
 * PATCH /travels/new
 * Update travel information
 * If travel's expenses dates are not within travel date range, update expenses and recalculate travel total
 */
exports.updateTravel = async function(req, res, next) {
  const currencyOptions = {
    allow_negatives: false,
    allow_negative_sign_placeholder: true,
    thousands_separator: ',',
    decimal_separator: '.',
    allow_decimal: true,
    require_decimal: false,
    digits_after_decimal: [2],
    allow_space_after_digits: false
  }
  req.assert('description', 'Description is empty or to long (max 120 characters)!').isLength({min: 1, max: 60});
  req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({min: 3, max: 3});
  req.assert('perMileAmount', 'Per mile amount should be positive number with 2 decimals!').isNumeric().isCurrency(currencyOptions);

  const dateCompare = moment(req.body.dateTo).add(1, 'days').format('YYYY-MM-DD');
  req.assert('dateFrom', 'Date from should be before date to').isBefore(dateCompare);

  const errors = req.validationErrors();
  const id = req.params.id;

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${id}`);
  }

  // Get data from html form to update travel
  const body = _.pick(req.body, ['description', 'dateFrom', 'dateTo', 'homeCurrency', 'perMileAmount']);

  if (!ObjectId.isValid(id)) {return next(new Error('Not valid Object Id'));}

  try {
    // Update travel with new data
    let travel = await Travel.findOneAndUpdate(
      {_id: id, _user: req.user.id},
      {$set: body}, {new: true})
      .populate({path: 'expenses', populate: {path: 'curRate'}});

    if (!travel) {return next(new Error('Travel not found'));}
    /*
     * Check expenses dates and set them within travel dates.
     * Calculate travel total. New expenses date, new rate.
     * Rates for same currency are not the same for different dates.
     */
    updateExpensesToMatchTravelRangeDates(travel, res.locals.rates).then((expenses) => {
      travel.save()
        .then((doc) => {
          Travel.findOne({_id: doc._id, _user: req.user.id})
          .populate({path: 'expenses', populate: {path: 'curRate'}})
          .then((doc) => {
            doc.updateTotal()
              .then((doc) => {
                req.flash('success', {msg: 'Travel successfully updated!'});
                res.redirect('/travels');
              });
          });
      });
    });

  } catch (err) {
    return next(err);
  }
};
