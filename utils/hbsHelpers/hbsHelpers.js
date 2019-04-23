const expressHbs = require('express-hbs');
const moment = require('moment');

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

})

// expressHbs.registerHelper('gravatar', (user) => {
//   return user.gravatar(60);
// })

expressHbs.registerHelper('debug', function(data, breakpoint) {
  console.log(data);
  if (breakpoint === true) {
    debugger;
  }
  return '';
});

expressHbs.registerHelper('gender', (userGender, radioButtonGender) => {
  return userGender == radioButtonGender;
})

expressHbs.registerHelper ("setChecked", function (value, currentValue) {

    if ( value == currentValue ) {

       return "checked";
    } else {
       return "";
    }
 });

 expressHbs.registerHelper("setOption", (value, currentValue) => {
   if (value == currentValue) {
     return "selected='selected'";
   } else {
     return;
   }
 })

 expressHbs.registerHelper('setValue', (value) => {
   // console.log(value);
   return `value=${value}`;
 })

 expressHbs.registerHelper('countList', (value) => {
   return value + 1;
 })

 expressHbs.registerHelper('formatDate', (date) => {
   if (!date) {
     const today = moment().format('YYYY-MM-DD');
     // console.log('wihout date', today);
     return today;
   }
   else {
     const today = moment(date).format('YYYY-MM-DD');
     // console.log('with date', today);
     return today;
   }
 });

 expressHbs.registerHelper('travelsList', function(items, options) {
  let out = "<ul>";

  for(let i=0, length=items.length; i<length; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});

expressHbs.registerHelper('setUnit', (homeDistance) => {
  if (homeDistance === 'mi') {
      return 'mile';
    } else if (homeDistance === 'km') {
      return 'km';
    } else {
      return '';
    }
});

expressHbs.registerHelper('setUnit2', (homeDistance) => {
  if (homeDistance != 'mi') {
      return 'mile';
    } else if (homeDistance != 'km') {
      return 'km';
    } else {
      return '';
    }
});

expressHbs.registerHelper('toNumber' , (valueAsString) => {
  return parseFloat(valueAsString);
});

expressHbs.registerHelper('getRate', (travelCurrencies, currency) => {
  // console.log(travelCurrencies, currency);
  const item = travelCurrencies.find((item) => {
    // console.log(cur);
    return item.currency.name === currency;
  });
  return item.value;
});

expressHbs.registerHelper('toCurrency', (number) => {
  const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  let numberString = formatter.format(number);
  return numberString;
});

// expressHbs.registerHelper('expenseRow', (index, expense) => {
//
//   const cell1 = `<th scope="row" class="text-center">${index + 1}</th>`;
//   const cell2 = `<td class="text-center">${expense.type}</td>`;
//   const cell3 = `<td><a href="/travels/${expense.travel}/{{this._id}}">${expense.description}</a></td>`;
//   const cell4 = `<td class="text-center">${moment(expense.date).format('YYYY-MM-DD')}</td>`;
//   const cell5 = `<td class="text-right">${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(expense.amount)}</td>`;
//   let cell6;
//   if (expense.unit) {
//     cell6 = `<td class="text-center">${expense.unit}</td>`;
//   } else {
//     cell6 = `<td class="text-center">${expense.currency}</td>`;
//   }
//   const cell7 = `<td class="text-right">${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(expense.rate)}</td>`;
//   const cell8 = `<td class="text-right">${new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(expense.amountConverted)}</td>`;
//   let htmlString =  join(cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8);
//   console.log(htmlString);
//   return htmlString;
// });
