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
  const label = 'home.index';
  logger.debug('Getting home', { label });
  if (!req.user) {
    logger.debug('user not exists', { label });
    res.render('home', {
      title: 'Home'
    });
  } else {
    logger.debug('user exists', { label });
    Travel.byYear_byMonth(req.user)
      .then(docs => {
        logger.debug('rendering home', { label });
        res.render('home', {
          title: 'Home',
          docs,
          constants
        });
      })
      .catch(err => {
        logger.error(err.message, { label });
        next(err);
      });
  }
};
