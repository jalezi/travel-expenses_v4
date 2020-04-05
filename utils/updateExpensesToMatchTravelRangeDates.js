const Expense = require('../models/Expense');
const Currency = require('../models/Currency');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('updateExpensesToMatchTravelRangeDates');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\updateExpensesToMatchTravelRangeDates INITIALIZING!');

const { findRatesByExactOrClosestDate } = require('./utils');
const { convertRateToHomeCurrencyRate } = require('./utils');

// Returns true if expense date is not in travel's dates range
async function checkExpenseDate(
  expDate,
  travelDateFrom,
  travelDateTo,
  requestId
) {
  const label = 'checkExpenseDate';
  const condition = expDate < travelDateFrom || expDate > travelDateTo;
  logger.debug(`Cheking expense date. Date in travel's dates: ${!condition}`, {
    label,
    requestId
  });
  if (condition) {
    return true;
  }
  return false;
}

// Returns new expense, based on travel dates range.
function setNewExpenseDate(expDate, travelDateFrom, travelDateTo, requestId) {
  const label = 'setNewExpenseDate';
  if (expDate < travelDateFrom) {
    logger.debug(
      `Expense date is lower than travel date from: ${expDate} < ${travelDateFrom}`,
      { label, requestId }
    );
    return travelDateFrom;
  }
  if (expDate > travelDateTo) {
    logger.debug(
      `Expense date is greater than travel date to: ${expDate} > ${travelDateTo}`,
      { label, requestId }
    );
    return travelDateTo;
  }
  return travelDateTo;
}

/*
Returns new currency object based on user default currency.
Throws Error if something goes wrong
*/
async function createNewCurrency(expenseDate, homeCurrency, invoiceCurrency) {
  const label = 'createNewCurrency';
  logger.debug('Creating new currency', { label });
  try {
    const cur = {};
    const dateRates = await findRatesByExactOrClosestDate(expenseDate);
    const convertedRate = convertRateToHomeCurrencyRate(
      dateRates.rates,
      homeCurrency,
      invoiceCurrency
    );
    cur[invoiceCurrency] = convertedRate;
    const curRate = new Currency({
      base: homeCurrency,
      date: expenseDate,
      rate: cur
    });
    logger.debug(
      `New currency: {base: ${curRate.base}, date: ${
        curRate.date
      }, rate: ${cur.toString()}}`,
      { label }
    );
    return { curRate, convertedRate };
  } catch (err) {
    throw new Error(err);
  }
}

// Updates expense data
async function updateExpense(
  expenseId,
  expenseAmount,
  expenseDate,
  convertedRate,
  rateObjectId
) {
  try {
    const amountConverted = Number((expenseAmount / convertedRate).toFixed(2));
    const doc = await Expense.findByIdAndUpdate(expenseId, {
      $set: {
        date: expenseDate,
        curRate: rateObjectId,
        amountConverted
      }
    });
    return doc;
  } catch (err) {
    throw new Error(err);
  }
}

// FIXME Promise executor functions should not be async

/*
  Updates all travel's expenses
  Loops through all expenses
  Checks if expense date is in travel's dates range
  Checks if expense type is mileage

*/
module.exports = async travel =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const label = 'UETMTRD';
    logger.debug('UETMTRD START', { label });
    const { expenses } = travel;
    const result = [];
    if (expenses.length === 0) {
      logger.silly('No expenses to update', { label });
      logger.debug('UETMTRD END', { label });
      return resolve(result);
    }

    logger.silly(`Expenses to check: ${expenses.length}`, { label });

    const { dateFrom } = travel;
    const { dateTo } = travel;
    const travelHomeCurrency = travel.homeCurrency;

    try {
      await expenses.forEach(async (expense, index) => {
        let label = expense.type;
        const requestId = index + 1;
        logger.silly(`result length: ${result.length}`, { label, requestId });
        logger.silly(`expenses length: ${expenses.length}`, {
          label,
          requestId
        });
        logger.silly(`${result.length === expenses.length}`, {
          label,
          requestId
        });
        if (await checkExpenseDate(expense.date, dateFrom, dateTo, requestId)) {
          label = `${label} - new date`;
          expense.date = setNewExpenseDate(expense.date, dateFrom, dateTo, requestId);
          logger.silly(`New expense date: ${expense.date}`, {
            label,
            requestId
          });

          if (expense.type !== 'Mileage') {
            logger.silly('Expense type not mileage', { label, requestId });
            let invoiceCurrency = Object.keys(expense.curRate.rate)[0];
            Currency.find(
              { base: travelHomeCurrency, date: expense.date },
              async (err, curRates) => {
                const filertedRatesFromDB = curRates.filter(
                  // eslint-disable-next-line no-restricted-globals
                  item => !isNaN(item.rate[invoiceCurrency])
                );
                if (filertedRatesFromDB.length === 0) {
                  logger.silly('new currency', { label, requestId });
                  const { curRate, convertedRate } = await createNewCurrency(
                    expense.date,
                    travelHomeCurrency,
                    invoiceCurrency
                  );
                  await curRate.save();
                  const rateObjectId = curRate._id;
                  await updateExpense(
                    expense._id,
                    expense.amount,
                    expense.date,
                    convertedRate,
                    rateObjectId
                  ).then(doc => {
                    logger.silly('Expense updated', { label }, requestId);
                    result.push(doc);
                    if (result.length === expenses.length) {
                      logger.debug('UETMTRD END', { label, requestId });
                      return resolve(result);
                    }
                  });
                } else {
                  logger.silly('old currency', { label, requestId });
                  const convertedRate =
                    filertedRatesFromDB[0].rate[invoiceCurrency];
                  const rateObjectId = filertedRatesFromDB[0]._id;
                  await updateExpense(
                    expense._id,
                    expense.amount,
                    expense.date,
                    convertedRate,
                    rateObjectId
                  ).then(doc => {
                    logger.silly('Expense updated', { label, requestId });
                    result.push(doc);
                    if (result.length === expenses.length) {
                      logger.debug('UETMTRD END', { label, requestId });
                      return resolve(result);
                    }
                  });
                }
              }
            );
          } else {
            logger.silly('Expense type mileage', { label, requestId });
            await expense.save(doc => {
              logger.silly('Expense saved', { label, requestId });
              result.push(doc);
              if (result.length === expenses.length) {
                logger.debug('UETMTRD END', { label, requestId });
                return resolve(result);
              }
            });
          }
        } else {
          label = `${label} - old date`;
          result.push(expense);
          if (result.length === expenses.length) {
            logger.debug('UETMTRD END', { label, requestId });
            return resolve(result);
          }
        }
      });
      // if (result.length === expenses.length) {
      //   logger.debug('UETMTRD END', { label });
      //   return resolve(result);
      // }
    } catch (err) {
      logger.error(err.message, { label });
      logger.debug('UETMTRD END', { label });
      return reject(new Error(err));
    }
  });
