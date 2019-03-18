const expressHbs = require('express-hbs');
const moment = require('moment');
// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
//
// const $ = require('jquery')(window);
// const $ = require('jquery');

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

 expressHbs.registerHelper('setValue', (value) => {
   console.log(value);
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

expressHbs.registerHelper('checkTypeMileage', (id) => {

  // $(document).ready(() => {
  //   console.log(document.getElementById('expenseType'));
  //   console.log(window.document.getElementById('expenseType'));
  //   console.log($('document'));
  //   console.log($('#expenseType'));
    console.log(id);
  // })
  //
  // console.log();
  // console.log();
  //
  // $('document').ready(() => {
  //   console.log(document.getElementById('expenseType'));
  //   console.log(window.document.getElementById('expenseType'));
  //   console.log($('document'));
  //   console.log($('#expenseType'));
  //   console.log(id);
  // })



  // document.location.refferer;

  // console.log($(document));

  // console.log(document.$('#expenseType'));
  // const expenseType = $.getElementById('expenseType');
  // console.log(expenseType);
  // const value = expenseType.options[expenseType.selectedIndex].value;
  // const text = expenseType.options[expenseType.selectedIndex].text;
  // console.log(value);
  // console.log(text);
})
