const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('user');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\userMiddleware INITIALIZING');

exports.reqAssertion = req => {
  logger.debug('reqAssertion');
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.assert('fName', 'First name should not be empty').notEmpty();
  req.assert('lName', 'Last name should not be empty').notEmpty();
  req.assert('team', 'Team should not be empty').notEmpty();
  req.assert('jobPosition', 'Position should not be empty').notEmpty();

  const errors = req.validationErrors();

  logger.debug('reqAssertion END');
  return errors;
};
