const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('populateModels');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\middleware\\populateModels INITIALIZING!');

const Travel = require('../../models/Travel');
const Expense = require('../../models/Expense');
const Rate = require('../../models/Rate');

exports.populateTravel = async travelId => {
  logger.debug('populateTravel');
  const travel = await Travel.findById(travelId).populate({
    path: 'expenses',
    populate: { path: 'curRate' }
  });

  logger.silly({ travel });
  logger.debug('populateTravel END');
  return travel;
};

exports.populateExpense = async travelId => {
  logger.debug('populateExpense');
  const expense = await Expense.findById(travelId).populate({
    path: 'curRate'
  });
  logger.silly({ expense });
  logger.debug('populateExpense END');
  return expense;
};

exports.findRates = async travel => {
  logger.debug('findRates');
  let rates = await Rate.findRatesOnDate(travel, err => {
    if (err) {
      logger.error(err);
      logger.debug('findRates END');
      return err;
      // throw err;
    }
  });

  if (rates.length === 0) {
    rates = await Rate.findRateBeforeOrAfterDate(travel, err => {
      if (err) {
        logger.error(err);
        logger.debug('findRates END');
        return new Error(err);
        // throw new Error(err);
      }
    });
  }

  logger.silly(`Find rates length: ${rates.length}`);
  logger.debug('findRates END');
  return rates;
};
