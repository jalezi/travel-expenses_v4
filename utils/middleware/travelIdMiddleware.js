const { addLogger } = require('../../loaders/logger');
const Travel = require('../../models/Travel');
const Rate = require('../../models/Rate');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = async (req, res, next) => {
  Logger.silly('travelIdMiddleware');
  if (
    (!res.locals.travel || res.locals.travel._id !== req.params.id) &&
    req.params.id !== 'new' &&
    req.params.id !== 'total_pdf'
  ) {
    try {
      const travel = await Travel.findById(req.params.id).populate({
        path: 'expenses',
        populate: { path: 'curRate' }
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
      res.locals.travel = travel;
      res.locals.rates = rates;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
};
