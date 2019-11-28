const { isAuthenticated } = require('../../config/passport');
const expenseController = require('../../controllers/expense');
const { addLogger } = require('../logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = app => {
  Logger.debug('Expenses routes initializing');
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
