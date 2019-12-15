/* eslint-disable func-names */
const expressHbs = require('express-hbs');
const moment = require('moment');
<<<<<<< HEAD
// const createElement = require('../utils').createElement;
=======
// eslint-disable-next-line no-unused-vars
const { createElement } = require('../utils');
>>>>>>> develop

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

<<<<<<< HEAD
expressHbs.registerHelper('debug', (data) => {
  console.log(data);
  // if (breakpoint === true) {
  //   debugger;
  // }
});

expressHbs.registerHelper('gender', (userGender, radioButtonGender) => userGender === radioButtonGender);

expressHbs.registerHelper('setChecked', (value, currentValue) => {
  if (value === currentValue) {
    return 'checked';
  }

  return '';
});

expressHbs.registerHelper('setOption', (value, currentValue) => {
  if (value === currentValue) {
    return "selected='selected'";
=======
// eslint-disable-next-line prefer-arrow-callback
expressHbs.registerHelper('debug', function(data, breakpoint) {
  Logger.debug(data);
  if (breakpoint === true) {
    // eslint-disable-next-line no-debugger
    debugger;
>>>>>>> develop
  }
  return '';
});

<<<<<<< HEAD
expressHbs.registerHelper('setValue', (value) => `value=${value}`);

expressHbs.registerHelper('countList', (value) => value + 1);

expressHbs.registerHelper('formatDate', (date) => {
=======
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
>>>>>>> develop
  if (!date) {
    const today = moment().format('YYYY-MM-DD');
    return today;
  }
<<<<<<< HEAD
=======

>>>>>>> develop
  const today = moment(date).format('YYYY-MM-DD');
  return today;
});

<<<<<<< HEAD
expressHbs.registerHelper('formatMonth', (date) => {
  if (!date) {
    const today = moment().format('MMMM, YYYY');
    return today;
  }
  const today = moment(date).format('MMMM, YYYY');
  return today;
});

expressHbs.registerHelper('travelsList', (items, options) => {
  let out = '<ul>';

  // eslint-disable-next-line prefer-destructuring
  for (let i = 0, length = items.length; i < length; i++) {
    out = `${out}<li>${options.fn(items[i])}</li>`;
  }

  return `${out}</ul>`;
=======
expressHbs.registerHelper('formatMonth', date => {
  Logger.debug('formatMonth helper');
  if (!date) {
    const today = moment().format('MMMM, YYYY');
    return today;
  }

  const today = moment(date).format('MMMM, YYYY');
  return today;
>>>>>>> develop
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
<<<<<<< HEAD
  }
  return 'km';
});

expressHbs.registerHelper('setUnit2', (homeDistance) => {
  if (homeDistance !== 'mi') {
    return 'mile';
  }
  return 'km';
});

expressHbs.registerHelper('toNumber', (valueAsString) => parseFloat(valueAsString));

expressHbs.registerHelper('getRate', (travelCurrencies, currency) => {
  const item = travelCurrencies.find((item) => item.currency.name === currency);
  return item.value;
});

expressHbs.registerHelper('toCurrency', (number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const numberString = formatter.format(number);
=======
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
>>>>>>> develop
  return numberString;
});
