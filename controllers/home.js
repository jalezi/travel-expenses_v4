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
  logger.debug('Getting home START');
  if (!req.user) {
    const label = 'user not exists';
    logger.debug('rendering home', { label });
    logger.debug('Getting home ENDS');
    res.render('home', {
      title: 'Home'
    });
  } else {
    res.render('home', {
      title: 'Home'
    });
    // const label = 'user exists';
    // Travel.byYear_byMonth(req.user)
    //   .then(docs => {
    //     logger.silly(`Travel docs found: ${docs.length}`, { label });
    //     logger.debug('rendering home', { label });
    //     logger.debug('Getting home ENDS');
    //     res.render('home', {
    //       title: 'Home',
    //       docs,
    //       constants
    //     });
    //   })
    //   .catch(err => {
    //     const label = 'catch error';
    //     logger.error(err.message, { label });
    //     logger.silly('next(err)', { label });
    //     logger.debug('Getting home ENDS');
    //     next(err);
    //   });
  }
};
