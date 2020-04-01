const moment = require('moment');

const { currencyOptions } = require('./utils');
const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('user');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\userMiddleware INITIALIZING');

exports.reqAssertion = req => {
  const label = 'travel.reqAssertion';
  logger.debug('travel.reqAssertion START', { label });

  req
    .assert(
      'description',
      'Description is empty or to long (max 120 characters)!'
    )
    .isLength({ min: 1, max: 60 });
  req
    .assert('homeCurrency', 'Home currency should have exactly 3 characters!')
    .isLength({ min: 3, max: 3 });
  req
    .assert(
      'perMileAmount',
      'Per mile amount should be positive number with 2 decimals!'
    )
    .isNumeric()
    .isCurrency(currencyOptions);

  const dateCompare = moment(req.body.dateTo)
    .add(1, 'days')
    .format('YYYY-MM-DD');
  req
    .assert('dateFrom', 'Date from should be before date to')
    .isBefore(dateCompare);

  const errors = req.validationErrors();
  if (!errors) {
    logger.silly('No req assertion errors', { label });
  } else {
    logger.silly('There are some req assertion errors', { label });
  }
  logger.debug('travel.reqAssertion END', { label });
  return errors;
};
