const LoggerClass = require('../LoggerClass');

const Logger = new LoggerClass('expense');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\routes\\expense INITIALIZING!');

const { isAuthenticated } = require('../passport');
const expenseController = require('../../controllers/expense');

/**
 * Defines Expenses routes.
 * @module config/routes/expenses
 * @requires module:config/LoggerClass
 * @requires module:config/passport
 * @requires module:controllers/expense
 */

/**
 * Expenses Routes.
 * @param {Express} app
 */
module.exports = app => {
  logger.debug('Expenses routes initializing');
  app.post(
    '/travels/:id/expenses/new',
    isAuthenticated,
    expenseController.postNewExpense
  );
  app.get(
    '/travels/:id/expenses/:id',
    isAuthenticated,
    expenseController.getExpense
  );
  app.patch(
    '/travels/:id/expenses/:id',
    isAuthenticated,
    expenseController.updateExpense
  );
  app.delete(
    '/travels/:id/expenses/:id',
    isAuthenticated,
    expenseController.deleteExpense
  );
};
