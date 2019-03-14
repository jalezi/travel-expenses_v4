const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');

const User = require('../models/User');
const Travel = require('../models/Travel');
const ObjectId = mongoose.Types.ObjectId;

// get all travels
exports.getTravels = async function(req, res) {
  const travels = await Travel.find({
    user: req.user._id
  });
  res.render('travels/travels', {
    title: 'Travels',
    travels: travels
  });
}

// get all travels
exports.getNewTravel = async function(req, res) {
  // const travels = await Travel.find({
  //   user: req.user._id
  // });
  res.render('travels/new', {
    title: 'New travel'
    // travels: travels
  });
}

// post travels
// create new travel
exports.postNewTravel = async function(req, res, next) {

  const dateFrom = moment(req.body.dateFrom);
  const dateTo = moment(req.body.dateTo);
  const travel = new Travel({
    user: req.user._id,
    description: req.body.description,
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
      }
    }, (err, user) => {
      if (err) {
        return next(err);
      }
    })
  } catch (err) {
    return next(err);
  }
  res.redirect('/');

}
