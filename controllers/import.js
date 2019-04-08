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
