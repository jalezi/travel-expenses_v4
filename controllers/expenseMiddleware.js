const moment = require('moment');
const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('expense');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\expenseMiddleware INITIALIZING');

const Currency = require('../models/Currency');

const currencyOptions = {
  allow_negatives: false,
  allow_negative_sign_placeholder: true,
  thousands_separator: ',',
  decimal_separator: '.',
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2],
  allow_space_after_digits: false
};

const decimalOptions = { decimal_digits: 2 };

exports.reqAssertExpense = (req, res) => {
  logger.debug('reqAssertUpdateExpense');
  req
    .assert(
      'expenseDescription',
      'Description is empty or to long (max 60 characters)!'
    )
    .isLength({ min: 1, max: 60 });
  let dateCompare = moment(res.locals.travel.dateFrom)
    .add(-1, 'days')
    .format('YYYY-MM-DD');
  req
    .assert('invoiceDate', 'Invoice date should be within travel dates')
    .isAfter(dateCompare);
  dateCompare = moment(res.locals.travel.dateTo)
    .add(1, 'days')
    .format('YYYY-MM-DD');
  req
    .assert('invoiceDate', 'Invoice date should be within travel dates')
    .isBefore(dateCompare);

  if (req.body.expenseType === 'Mileage') {
    req
      .assert(
        'travelPerMileAmount',
        'Per mile amount should be positive number with 2 decimals!'
      )
      .isDecimal(decimalOptions);
    req
      .assert('invoiceUnit', 'Must be "km" or "mi"')
      .custom(
        () => req.body.invoiceUnit === 'km' || req.body.invoiceUnit === 'mi'
      );
    req
      .assert('amountDistance', 'Number with 2 decimals')
      .isDecimal(decimalOptions);
    req
      .assert('amountDistance2', 'Number with 2 decimals')
      .isDecimal(decimalOptions);
    req
      .assert('amountConverted2', 'Number with 2 decimals')
      .isDecimal(decimalOptions);
  } else {
    req
      .assert('invoiceCurrency', 'Currency name must be 3 characters long')
      .isLength({ min: 3, max: 3 });
    req
      .assert('rate', 'Currency rate with 2 decimals')
      .isNumeric()
      .isCurrency(currencyOptions);
    req.assert('amount', 'Number with 2 decimals').isDecimal(decimalOptions);
    req
      .assert('amountConverted', 'Number with 2 decimals')
      .isDecimal(decimalOptions);
  }

  const errors = req.validationErrors();

  logger.debug('reqAssertUpdateExpense END');
  return errors;
};

exports.getCurRate = async (req, res, next) => {
  logger.debug('getCurRate');
  const { invoiceDate } = req.body;
  const invoiceCurrency = req.body.invoiceCurrency.toUpperCase();
  const { rate } = req.body;
  let cur = {};

  cur[invoiceCurrency] = Number(rate);
  let curRate = {};
  await Currency.find(
    {
      base: res.locals.travel.homeCurrency,
      date: invoiceDate,
      rate: cur
    },
    async (err, item) => {
      if (err) {
        return err;
      }
      if (item.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        curRate = item[0];
      } else {
        curRate = new Currency({
          base: res.locals.travel.homeCurrency,
          date: invoiceDate,
          rate: cur
        });
        await curRate
          .save()
          .then(doc => {
            logger.silly({ currency: doc });
          })
          .catch(err => {
            logger.error(err);
            logger.debug('getCurRate END');
            return next(err);
          });
      }
    }
  );

  logger.debug({ currency: curRate });
  logger.debug('getCurRate END');
  return (curRate);
};
