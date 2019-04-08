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

exports.getImport = async function(req, res, next) {
  res.render('travels/import', {
    title: 'Import'
  })
}

async function checkFile(condition, message) {
  const suffix = 'File should be a CSV with header in first line and not empty!'
  if (condition) {
    throw new Error(`${message} - ${suffix}`);
  }
}


async function readAndParseFile(filePath, enc='utf8') {
  try {
    const myFile = fs.readFileSync(filePath, enc);
    const parsedData = Papa.parse(myFile, {
      quoteChar: '"',
      escapeChar: '"',
      header: true,
      dynamicTyping: false,
      preview: 0,
      encoding: "utf8",
      complete: (results) => {
      },
      skipEmptyLines: true
    });
    return parsedData;
  } catch (err) {
    throw err;
  }
}

function deleteFile(filePath, message='') {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw err;
        }
        console.log(message);
      });
    }
  } catch (err) {
    console.log(`File: ${filePath} not deleted!`);
    throw err;
  }
}


exports.postImport = async function(req, res, next) {
  let message = '';
  const travelHeaderArray = constants.TRAVEL_HEADER;
  const myFilePath = req.files.myFile.path;
  try {
    // check if file is selected, not empty and CSV
    await checkFile(req.files.myFile.name === '', 'No file selected!');
    await checkFile(req.files.myFile.size === 0, 'Empty file!');
    await checkFile(myFilePath.split('.').pop() != 'csv', 'Not a CSV file!');
    const parsedData = await readAndParseFile(myFilePath);

    // check if file has correct header
    const dataArray = parsedData.data;
    const parsedHeaderArray = parsedData.meta.fields;
    await checkFile(!_.isEqual(travelHeaderArray, parsedHeaderArray), `Header should be: ${travelHeaderArray}`);
    _.forEach(dataArray, (value, key) => {
      dataArray[key]._user = req.user._id;
    })
    const travels = await Travel.insertMany(dataArray);
    const travelObjectIds = travels.map(travel => travel._id);
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {'travels':{ $each: travelObjectIds} }
    });

    deleteFile(myFilePath, 'File deleted after processed!');
    message = `${travelObjectIds.length} travels added successfully!`
    req.flash('success', {msg: message});
    res.redirect('/travels')

  } catch (err) {
    deleteFile(myFilePath, 'File deleted after error!');
    req.flash('errors', {msg: err.message})
    console.log(err);
    res.redirect('/import');
  }
}

// get all travels
exports.getTravels = async function(req, res) {
  const travels = await Travel.find({
    _id: {
      $in: req.user.travels
    }
  });
  res.render('travels/travels', {
    title: 'Travels',
    travels
  });
}


// get all travels
exports.getNewTravel = async function(req, res) {
  // console.log('getNewTravel');
  // const travels = await Travel.find({
  //   user: req.user._id
  // });
  res.render('travels/new', {
    title: 'New travel',
    user: req.user
  });
}

// post travels
// create new travel
exports.postNewTravel = async function(req, res, next) {

  req.assert('description', 'Description is empty or to long (max 60 characters)!').isLength({
    min: 1,
    max: 60
  });
  req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({
    min: 3,
    max: 3
  });

  const decimalOptions = {
    decimal_digits: 2
  };
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
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        'travels': doc._id
      },
    }, (err, user) => {
      if (err) {
        return next(err);
      }
    });
  } catch (err) {
    return next(err);
  }

  req.flash('success', {
    msg: 'Successfully added new travel!'
  });
  res.redirect('/travels');
}

exports.getTravel = async function(req, res, next) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  const travel = res.locals.travel;


  try {
    const expenses = travel.expenses;

    expenses.forEach((expense, index, arr) => {
      if (expense.type != 'Mileage') {
        const rate = Object.values(expense.curRate.rate)[0];
        expense.rate = rate.toFixed(2);
      } else {
        expense.rate = travel.perMileAmount;
      }
    });

    if (!travel) {
      return next(new Error('Travel not found'))
    }

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

exports.deleteTravel = async function(req, res, next) {
  const id = req.params.id;
  // console.log(id);

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  try {
    const travel = await Travel.findOneAndDelete({
      _id: id,
      _user: req.user._id
    });

    if (!travel) {
      req.flash('error', {
        msg: 'Travel not found!!'
      });
      return next(new Error('Travel not found'));
    }

    Expense.deleteMany({
      travel: travel._id,
      _user: req.user._id
    }, (err) => {
      if (err) {
        return next(err)
      }
    });

    User.findByIdAndUpdate(req.user._id, {
      $pullAll: {
        'travels': [travel._id]
      }
    }, (err, user) => {
      if (!err) {
        return next(err);
      }
    });
    req.flash('success', {
      msg: 'Travel successfully deleted!'
    });
    res.redirect('/travels');
  } catch (err) {
    return next(err);
  }
};

exports.updateTravel = async function(req, res, next) {

  req.assert('description', 'Description is empty or to long (max 120 characters)!').isLength({
    min: 1,
    max: 60
  });
  req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({
    min: 3,
    max: 3
  });
  req.assert('perMileAmount', 'Per mile amount should be positive number with 2 decimals!').isNumeric().isCurrency({
    allow_negatives: false,
    allow_negative_sign_placeholder: true,
    thousands_separator: ',',
    decimal_separator: '.',
    allow_decimal: true,
    require_decimal: false,
    digits_after_decimal: [2],
    allow_space_after_digits: false
  });


  const dateCompare = moment(req.body.dateTo).add(1, 'days').format('YYYY-MM-DD');
  req.assert('dateFrom', 'Date from should be before date to').isBefore(dateCompare);

  const errors = req.validationErrors();
  const id = req.params.id;

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${id}`);
  }

  const body = _.pick(req.body, ['description', 'dateFrom', 'dateTo', 'homeCurrency', 'perMileAmount']);

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  try {
    let travel = await Travel.findOneAndUpdate({
      _id: id,
      _user: req.user.id
    }, {
      $set: body
    }, {
      new: true
    }).populate({
      path: 'expenses',
      populate: {
        path: 'curRate'
      }
    });

    if (!travel) {
      return next(new Error('Travel not found'));
    }

    await updateExpensesToMatchTravelRangeDates(travel, res.locals.rates);
    await travel.save();
    travel = await Travel.findOne({
      _id: travel._id,
      _user: req.user.id
    }).populate({
      path: 'expenses',
      populate: {
        path: 'curRate'
      }
    });
    const total = await travel.updateTotal();
    travel.total = parseFloat(total).toFixed(2);
    await travel.save();

    req.flash('success', {
      msg: 'Travel successfully updated!'
    });
    res.redirect('/travels');
  } catch (err) {
    return next(err);
  }
};
