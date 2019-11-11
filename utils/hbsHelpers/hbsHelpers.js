const expressHbs = require('express-hbs');
const moment = require('moment');
// const createElement = require('../utils').createElement;

expressHbs.registerHelper('flash', (message) => {
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
  }
  return '';
});

expressHbs.registerHelper('setValue', (value) => `value=${value}`);

expressHbs.registerHelper('countList', (value) => value + 1);

expressHbs.registerHelper('formatDate', (date) => {
  if (!date) {
    const today = moment().format('YYYY-MM-DD');
    return today;
  }
  const today = moment(date).format('YYYY-MM-DD');
  return today;
});

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
});

expressHbs.registerHelper('setUnit', (homeDistance) => {
  if (homeDistance === 'mi') {
    return 'mile';
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
  return numberString;
});
