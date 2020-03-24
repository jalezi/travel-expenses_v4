/* eslint-disable func-names */

const Rate = require('../models/Rate');
const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('utils');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\utils INITIALIZING!');

// Converts number to currency format
function toCurrencyFormat(amount) {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const result = formatter.format(amount);
  return result;
}

// Converts rate based on user default currency
const convertRateToHomeCurrencyRate = (
  rates,
  homeCurrency,
  invoiceCurrency
) => {
  logger.debug('Convert rate to home currency rate');
  homeCurrency = homeCurrency.toUpperCase();
  invoiceCurrency = invoiceCurrency.toUpperCase();

  const homeCurrencyRate = rates[homeCurrency];
  const convertedRate = 1 / homeCurrencyRate;
  const baseRate = rates[invoiceCurrency];
  const invoiceRate = Number((baseRate * convertedRate).toFixed(2));
  return invoiceRate;
};

/*
 Returns date with rates on exact day.
 If there are no rates for exact date in DB,
 find rates for closest date and returns date for closest matching date.
*/
const findRatesByExactOrClosestDate = async (date = new Date()) => {
  logger.debug('Find rates by exact or closest date');
  try {
    const exactDate = await Rate.find({ date }, (err, items) => items);
    if (exactDate.length === 1) {
      logger.debug(`Find rates for EXACT date: ${exactDate[0].date}`);
      return exactDate[0];
    }

    const greaterDate = await Rate.findOne(
      {
        date: { $gt: date }
      },
      (err, item) => item
    ).sort({ date: 1 });

    const lowerDate = await Rate.findOne(
      {
        date: { $lt: date }
      },
      (err, item) => item
    ).sort({ date: -1 });

    // FIXME Try to refactor - it's ugly
    if (greaterDate && lowerDate) {
      const diffGreater = Math.abs(date.getTime() - greaterDate.date.getTime());
      const diffLower = Math.abs(date.getTime() - lowerDate.date.getTime());

      if (diffGreater < diffLower) {
        logger.debug('Later date is closer than earlier date');
        logger.debug(`Find rates for date: ${greaterDate.date}`);
        return greaterDate;
      }
      logger.debug('Earlier date is closer than later date');
      logger.debug(`Find rates for date: ${lowerDate.date}`);
      return lowerDate;
    }
    if (!greaterDate && !lowerDate) {
      logger.warn('Could not calculate dates difference');
      return 'FUCK!';
    }
    if (greaterDate) {
      logger.warn('Could not calculate date difference to lower date');
      logger.debug(`Find rates for date: ${greaterDate.date}`);
      return greaterDate;
    }
    if (lowerDate) {
      logger.warn('Could not calculate date difference to greater date');
      logger.debug(`Find rates for date: ${lowerDate.date}`);
      return lowerDate;
    }
    // FIXME throw error
    logger.error('Could not find any rates for exact, greater or lower date');
    return 'FUCK AGAIN!';
  } catch (err) {
    logger.error(err.message);
    return err;
  }
};

// Converts string TitleCase string
const toTitleCase = str =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

// eslint-disable-next-line no-extend-native
String.prototype.splice = function(idx, rem, str) {
  // eslint-disable-line func-names
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

// Creates HTML element as string
const createElement = (
  tag,
  options = {},
  text = 'Hello World',
  closingTag = true
) => {
  let tagStart = `<${tag}>`;
  let tagEnd = `</${tag}>`;
  let attrs = '';
  let result = '';
  const insertIndex = tagStart.length - 1;
  const attrArray = [' '];
  // eslint-disable-next-line no-restricted-syntax
  for (let [attr, val] of Object.entries(options)) {
    attr = attr.replace(/_/g, '-');
    const arr = [];
    if (val instanceof Array) {
      val.forEach(val1 => {
        let val2 = `${val1} `;
        arr.push(val2);
      });
    } else {
      arr.push(val);
    }
    let rAttr = arr.join('');
    let lAttr = `${attr}="${rAttr}"`;
    attrArray.push(lAttr);
  }
  attrs = attrArray.join(' ');
  tagStart = tagStart.splice(insertIndex, 0, attrs);
  if (closingTag) {
    result = tagStart + text + tagEnd;
  } else {
    result = tagStart + text;
  }
  if (!result) {
    logger.warn('Element was not created');
  }
  return result;
};

// Creates 2 HTML elements as one string
const createTwoCardElements = (
  tagArr,
  optionArr,
  textArr = ['', ''],
  closingArr = [true, true, true],
  insert = ''
) => {
  const labelText = createElement(
    tagArr[0],
    optionArr[0],
    textArr[0],
    closingArr[0]
  );
  const labelElem = createElement(
    tagArr[1],
    optionArr[1],
    labelText,
    closingArr[1]
  );
  const expenseElem = createElement(
    tagArr[2],
    optionArr[2],
    textArr[1],
    closingArr[2]
  );
  return labelElem + insert + expenseElem;
};

// Creates HTML options element, second param option to select
const createOptions = (
  options,
  selected,
  elemAttrs = {},
  valueToLowerCase = false
) => {
  logger.silly('createOptions');
  let result = '';
  selected = !selected ? '' : selected;
  options.forEach(val => {
    const optionVal = valueToLowerCase ? val.toLowerCase() : val;
    elemAttrs.value = optionVal;
    if (optionVal.toLowerCase() === selected.toLowerCase()) {
      elemAttrs.selected = 'selected';
    }
    const htmlElem = createElement('option', elemAttrs, val);
    if (elemAttrs.selected) {
      delete elemAttrs.selected;
    }
    result += htmlElem;
  });
  delete elemAttrs.value;
  logger.silly('createOptions END');
  return result;
};

module.exports = {
  toCurrencyFormat,
  convertRateToHomeCurrencyRate,
  findRatesByExactOrClosestDate,
  toTitleCase,
  createElement,
  createTwoCardElements,
  createOptions
};
