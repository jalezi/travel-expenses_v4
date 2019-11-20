const { addLogger } = require('../../loaders/logger');
const Travel = require('../../models/Travel');
const Expense = require('../../models/Expense');
const Rate = require('../../models/Rate');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = async (req, res, next) => {
  Logger.silly('expenseIdMiddleware');
  if (
    (!res.locals.expense || res.locals.expense._id !== req.params.id) &&
    req.params.id !== 'new'
  ) {
    try {
      const baseUrl = req.baseUrl.split('/');
      const travelId = baseUrl[2];
      const travel = await Travel.findById(travelId).populate({
        path: 'expenses',
        populate: { path: 'curRate' }
      });
      const expense = await Expense.findById(req.params.id).populate({
        path: 'curRate'
      });
      let rates = await Rate.findRatesOnDate(travel, err => {
        if (err) {
          throw err;
        }
      });

      if (rates.length === 0) {
        rates = await Rate.findRateBeforeOrAfterDate(travel, err => {
          if (err) {
            throw new Error(err);
          }
        });
      }
      res.locals.expense = expense;
      res.locals.rates = rates;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
};
