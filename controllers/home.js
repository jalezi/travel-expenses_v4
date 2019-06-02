const moment = require('moment');
const Travel = require('../models/Travel');
/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {
  if (!req.user) {
    res.render('home', {
      title: 'Home'
    });
  } else {
    Travel.byYear_byMonth(req.user).then((docs) => {
      res.render('home', {
        title: 'Home',
        docs
      });
    }).catch((err) => {
      next(err);
    });
  }
};
