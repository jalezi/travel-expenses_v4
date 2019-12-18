const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('user');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\userMiddleware INITIALIZING');

exports.reqAssertion = (
  req, {
    email = false, password = false, cPassword = false,
    rPassword = false, hCurrency = false, profile = false
  }
) => {
  logger.debug('reqAssertion');
  logger.silly(`e: ${email}, p: ${password}, cP: ${cPassword}, hC: ${hCurrency}, pr:${profile}`);
  if (email) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
  }
  if (password) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
  }
  if (cPassword) {
    req
      .assert('confirmPassword', 'Passwords do not match!')
      .equals(req.body.password);
  }
  if (rPassword) {
    req
      .assert('confirm', 'Passwords do not match!')
      .equals(req.body.password);
  }
  if (hCurrency) {
    req
      .assert('homeCurrency', 'Home currency should have exactly 3 characters')
      .isLength({ min: 3, max: 3 });
  }

  if (profile) {
    req.assert('fName', 'First name should not be empty').notEmpty();
    req.assert('lName', 'Last name should not be empty').notEmpty();
    req.assert('team', 'Team should not be empty').notEmpty();
    req.assert('jobPosition', 'Position should not be empty').notEmpty();
  }


  const errors = req.validationErrors();

  logger.debug('reqAssertion END');
  return errors;
};
