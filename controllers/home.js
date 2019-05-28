const moment = require('moment');
const Travel = require('../models/Travel');
/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {
  // console.log('res.locals.keys', Object.keys(res.locals));
  // console.log('req.keys', Object.keys(req));
  if (!req.user) {
    res.render('home', {
      title: 'Home'
    });
  } else {
    Travel.byYear_byMonth(req.user).then((docs) => {
      docs.forEach((value, index) => {
        // console.log(index);
        // console.log(moment(value.dateFirst));
        // console.log(moment(value.dateLast));
        // console.log(value.byYear);
      });
      res.render('home', {
        title: 'Home',
        docs
      });
    }).catch((err) => {
      next(err);
    });
  }
};
