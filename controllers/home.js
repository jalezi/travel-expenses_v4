const Travel = require('../models/Travel');
const constants = require('../lib/constants');

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
    Travel.byYear_byMonth(req.user).then(docs => {
      res.render('home', {
        title: 'Home',
        docs,
        constants
      });
    }).catch(err => {
      next(err);
    });
  }
};
