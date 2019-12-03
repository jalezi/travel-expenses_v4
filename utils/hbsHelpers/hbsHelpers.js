/* eslint-disable func-names */
const expressHbs = require('express-hbs');
const moment = require('moment');
// eslint-disable-next-line no-unused-vars
const { createElement } = require('../utils');

const { addLogger } = require('../../config/logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

expressHbs.registerHelper('flash', message => {
  Logger.debug('flash helper');
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
expressHbs.registerHelper('debug', function(data, breakpoint) {
  Logger.debug(data);
  if (breakpoint === true) {
    // eslint-disable-next-line no-debugger
    debugger;
  }
  return '';
});

expressHbs.registerHelper('gender', (userGender, radioButtonGender) => {
  Logger.debug('gender helper');
  return userGender === radioButtonGender;
});

// eslint-disable-next-line prefer-arrow-callback
expressHbs.registerHelper('setChecked', function(value, currentValue) {
  Logger.debug('setChecked helper');
  if (value === currentValue) {
    return 'checked';
  }
  return '';
});

expressHbs.registerHelper('setOption', (value, currentValue) => {
  Logger.debug('setOption helper');
  if (value === currentValue) {
    return "selected='selected'";
  }
  // eslint-disable-next-line no-useless-return
  return;
});

expressHbs.registerHelper('setValue', value => {
  Logger.debug('setValue helper');
  return `value=${value}`;
});

expressHbs.registerHelper('countList', value => {
  Logger.debug('countList helper');
  return value + 1;
});

expressHbs.registerHelper('formatDate', date => {
  Logger.debug('formatDate helper');
  if (!date) {
    const today = moment().format('YYYY-MM-DD');
    return today;
  }

  const today = moment(date).format('YYYY-MM-DD');
  return today;
});

expressHbs.registerHelper('formatMonth', date => {
  Logger.debug('formatMonth helper');
  if (!date) {
    const today = moment().format('MMMM, YYYY');
    return today;
  }

  const today = moment(date).format('MMMM, YYYY');
  return today;
});

// eslint-disable-next-line prefer-arrow-callback
expressHbs.registerHelper('travelsList', function(items, options) {
  Logger.debug('travelList helper');
  let out = '<ul>';

  for (let i = 0, { length } = items; i < length; i++) {
    out = `${out}<li>${options.fn(items[i])}</li>`;
  }

  return `${out}</ul>`;
});

expressHbs.registerHelper('setUnit', homeDistance => {
  Logger.debug('setUnit helper');
  if (homeDistance === 'mi') {
    return 'mile';
  } if (homeDistance === 'km') {
    return 'km';
  }
  return '';
});

expressHbs.registerHelper('setUnit2', homeDistance => {
  Logger.debug('setUnit2 helper');
  if (homeDistance !== 'mi') {
    return 'mile';
  } if (homeDistance !== 'km') {
    return 'km';
  }
  return '';
});

expressHbs.registerHelper('toNumber', valueAsString => {
  Logger.debug('toNumber helper');
  return parseFloat(valueAsString);
});

expressHbs.registerHelper('getRate', (travelCurrencies, currency) => {
  Logger.debug('getRate helper');
  const item = travelCurrencies.find(item => item.currency.name === currency);
  return item.value;
});

expressHbs.registerHelper('toCurrency', number => {
  Logger.debug('toCurrency helper');
  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let numberString = formatter.format(number);
  return numberString;
});
