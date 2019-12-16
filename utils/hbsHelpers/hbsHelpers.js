/* eslint-disable func-names */
const expressHbs = require('express-hbs');
const moment = require('moment');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('hbsHelpers');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\hbsHelpers\\hbsHelpers INITIALIZING!');

// eslint-disable-next-line no-unused-vars
const { createElement } = require('../utils');

expressHbs.registerHelper('flash', message => {
  logger.debug('flash helper');
  if (message.error) {
    return message.error;
  }
  if (message.info) {
    return message.info;
  }
  if (message.success) {
    return message.success;
  }
});

// expressHbs.registerHelper('gravatar', (user) => {
//   return user.gravatar(60);
// })

// eslint-disable-next-line prefer-arrow-callback
expressHbs.registerHelper('debug', function (data, breakpoint) {
  // TODO if data is string
  logger.debug(data);
  if (breakpoint === true) {
    // eslint-disable-next-line no-debugger
    debugger;
  }
  return '';
});

expressHbs.registerHelper('gender', (userGender, radioButtonGender) => {
  logger.debug('gender helper');
  return userGender === radioButtonGender;
});

// eslint-disable-next-line prefer-arrow-callback
expressHbs.registerHelper('setChecked', function(value, currentValue) {
  logger.debug('setChecked helper');
  if (value === currentValue) {
    return 'checked';
  }
  return '';
});

expressHbs.registerHelper('setOption', (value, currentValue) => {
  logger.debug('setOption helper');
  if (value === currentValue) {
    return "selected='selected'";
  }
  // eslint-disable-next-line no-useless-return
  return;
});

expressHbs.registerHelper('setValue', value => {
  logger.debug('setValue helper');
  return `value=${value}`;
});

expressHbs.registerHelper('countList', value => {
  logger.debug('countList helper');
  return value + 1;
});

expressHbs.registerHelper('formatDate', date => {
  logger.debug('formatDate helper');
  if (!date) {
    const today = moment().format('YYYY-MM-DD');
    return today;
  }

  const today = moment(date).format('YYYY-MM-DD');
  return today;
});

expressHbs.registerHelper('formatMonth', date => {
  logger.debug('formatMonth helper');
  if (!date) {
    const today = moment().format('MMMM, YYYY');
    return today;
  }

  const today = moment(date).format('MMMM, YYYY');
  return today;
});

// eslint-disable-next-line prefer-arrow-callback
expressHbs.registerHelper('travelsList', function(items, options) {
  logger.debug('travelList helper');
  let out = '<ul>';

  for (let i = 0, { length } = items; i < length; i++) {
    out = `${out}<li>${options.fn(items[i])}</li>`;
  }

  return `${out}</ul>`;
});

expressHbs.registerHelper('setUnit', homeDistance => {
  logger.debug('setUnit helper');
  if (homeDistance === 'mi') {
    return 'mile';
  }
  if (homeDistance === 'km') {
    return 'km';
  }
  return '';
});

expressHbs.registerHelper('setUnit2', homeDistance => {
  logger.debug('setUnit2 helper');
  if (homeDistance === 'mi') {
    return 'km';
  }
  if (homeDistance === 'km') {
    return 'mile';
  }
  return '';
});

expressHbs.registerHelper('toNumber', valueAsString => {
  logger.debug('toNumber helper');
  return parseFloat(valueAsString);
});

expressHbs.registerHelper('getRate', (travelCurrencies, currency) => {
  logger.debug('getRate helper');
  const item = travelCurrencies.find(item => item.currency.name === currency);
  return item.value;
});

expressHbs.registerHelper('toCurrency', number => {
  logger.debug('toCurrency helper');
  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let numberString = formatter.format(number);
  return numberString;
});
