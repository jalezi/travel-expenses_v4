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

exports.getImport = async function(req, res, next) {
  const travels = res.locals.travels;
  
  res.render('travels/import', {
    title: 'Import',
    travels
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

async function travelImport (myFile, userId) {
  let message = '';
  const myFilePath = myFile.path;
  const travelHeaderArray = constants.IMPORT_TRAVEL_HEADER;
  try {
    // check if file is selected, not empty and CSV
    await checkFile(myFile.name === '', 'No file selected!');
    await checkFile(myFile.size === 0, 'Empty file!');
    await checkFile(myFilePath.split('.').pop() != 'csv', 'Not a CSV file!');

    const parsedData = await readAndParseFile(myFilePath);
    const dataArray = parsedData.data;

    // check if file has correct header
    const parsedHeaderArray = parsedData.meta.fields;
    await checkFile(!_.isEqual(travelHeaderArray, parsedHeaderArray), `Header should be: ${travelHeaderArray}`);

    // add user._id to travel
    _.forEach(dataArray, (value, key) => {
      dataArray[key]._user = userId;
    })

    // insert travels and update user with travel._id
    const travels = await Travel.insertMany(dataArray);
    const travelObjectIds = travels.map(travel => travel._id);
    await User.findByIdAndUpdate(userId, {
      $addToSet: {'travels':{ $each: travelObjectIds} }
    });

    message = `${travelObjectIds.length} travels added successfully!`
    return message;

  } catch (err) {
      throw err;
  }
}

async function expensesImport(myFile, userId) {

  let message = '';
  const myFilePath = myFile.path;
  const expenseHeaderArray = constants.IMPORT_EXPENSE_HEADER;
  try {
    // check if file is selected, not empty and CSV
    await checkFile(myFile.name === '', 'No file selected!');
    await checkFile(myFile.size === 0, 'Empty file!');
    await checkFile(myFilePath.split('.').pop() != 'csv', 'Not a CSV file!');

    const parsedData = await readAndParseFile(myFilePath);
    const dataArray = parsedData.data;
    console.log(dataArray);
    return 'Expense import'
  } catch (err) {
      throw err;
  }
}


exports.postImport = async function(req, res, next) {
  let message = '';
  const myFile = req.files.myFile;
  const myFilePath = req.files.myFile.path;

  try {
    if (req.body.option === 'travels') {
      message = await travelImport(myFile, req.user._id);

    } else {
      message = await expensesImport(myFile, req.user._id);

    }

    deleteFile(myFilePath, 'File deleted after processed!');
    req.flash('success', {msg: message});
    res.redirect('/travels')
  } catch (err) {
    deleteFile(myFilePath, 'File deleted after error!');
    req.flash('errors', {msg: err.message})
    console.log(err);
    res.redirect('/import');
  }
}
