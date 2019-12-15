const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('home');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\home INITIALIZING!');

const Travel = require('../models/Travel');
const constants = require('../lib/constants');

/**
 * Home route
 * @module controllers/home
 * @requires module:config/LoggerClass
 * @requires module:models/Travel
 * @requires module:lib/constants
 */

/**
 * GET /
 *
 * Home page.
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.index = (req, res, next) => {
  logger.debug('Getting home');
  if (!req.user) {
    res.render('home', {
      title: 'Home'
    });
  } else {
    Travel.byYear_byMonth(req.user)
      .then(docs => {
        res.render('home', {
          title: 'Home',
          docs,
          constants
        });
      })
      .catch(err => {
        next(err);
      });
  }
};
