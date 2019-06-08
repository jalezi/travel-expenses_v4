const expressHbs = require('express-hbs');
const moment = require('moment');
const createElement = require('../utils').createElement;

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
   return `value=${value}`;
 })

 expressHbs.registerHelper('countList', (value) => {
   return value + 1;
 })

 expressHbs.registerHelper('formatDate', (date) => {
   if (!date) {
     const today = moment().format('YYYY-MM-DD');
     return today;
   }
   else {
     const today = moment(date).format('YYYY-MM-DD');
     return today;
   }
 });

 expressHbs.registerHelper('formatMonth', (date) => {
   if (!date) {
     const today = moment().format('MMMM, YYYY');
     return today;
   }
   else {
     const today = moment(date).format('MMMM, YYYY');
     return today;
   }
 })

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
  const item = travelCurrencies.find((item) => {
    return item.currency.name === currency;
  });
  return item.value;
});

expressHbs.registerHelper('toCurrency', (number) => {
  const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  let numberString = formatter.format(number);
  return numberString;
});

/*
 * Returns HTML elements
 * @param {object} value Array with travels mongo aggregate group by year and each year group by month
 * more in Travel Schema /models/Travel.js Travel.byYear_byMonth
 */
expressHbs.registerHelper('yearsAccordion', (value) => {
  const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  // HTML Accordion - RESULT
  const yearObjectsArray = [];
  value.forEach((yearObject) => {
    const yearString = yearObject._id.year.toString();
    // HTML Year Card COLLAPSE - BODY
    const monthObjectsArray = [];
    yearObject.byYear.forEach((monthObject) => {
      const monthValue = monthObject._id.month-1;
      const monthString = moment().month(monthValue).format('MMMM');
      const travelObjectsArray = [];
      // HTML Month Card COLLAPSE - BODY
      monthObject.byMonth.forEach((travelObject) => {
        console.log(travelObject);
        const dateFromString = moment(travelObject.dateFrom).format('YYYY-MM-DD');
        const travelId = travelObject._id;
        const expensesCount = travelObject.expenses.length;
        const hrefTravel = `/travels/${travelId}`;
        // HTML Travel Card COLLAPSE - BODY
        const expenseObjectsArray = [];
        travelObject.expenses.forEach((expenseObject) => {
          const expenseId = expenseObject._id;
          const expenseDate = expenseObject.date;
          const expenseDateString = moment(expenseDate).format('YYYY-MM-DD');
          const amountString = formatter.format(expenseObject.amount);
          const amountConvertedString = formatter.format(expenseObject.amountConverted);
          // Different data if expenseObject.type = Mileage
          let currency_unit, rate, rateText, amountLabelText;
          if (expenseObject.type != 'Mileage') {
            currency_unit = expenseObject.currency;
            let curRate = travelObject.curRates.find((exp) => {
              return exp._id.toString() === expenseObject.curRate.toString();
            });
            if (curRate) {
              rate = formatter.format(curRate.rate[expenseObject.currency]);
            } else {
              rate = formatter.format(0);
            }
            rateText = `1 ${travelObject.homeCurrency} = ${rate} ${currency_unit}`;
            amountLabelText = 'Amount in local currency'
          } else {
            currency_unit = expenseObject.unit;
            rate = formatter.format(Number(travelObject.perMileAmount));
            rateText = `1 ${currency_unit} = ${rate} ${travelObject.homeCurrency}`;
            amountLabelText = 'Distance'
          }
          // HTML Expense Card ELEMENTS OPTIONS
          const titleOption = {class:'card-title', id:`heading${expenseId}_CardTitle`};
          const labelTextOption = {class:'card-text'};
          const labelOption = {class: 'card-text text-warning mb-0'};
          const expenseOption = {class:'card-text mb-1'};
          // Card Body tags and attributes for expenseObject values
          const htmlTagsArr = ['small', 'p', 'p'];
          const htmlOptionsArr = [labelTextOption, labelOption, expenseOption];
          /*
           * Returns 2 HTML elements as one string
           */
          const createCardTextElems = (tagArr, optionArr, textArr) => {
            const labelText = createElement(tagArr[0], optionArr[0], textArr[0]);
            const labelElem = createElement(tagArr[1], optionArr[1], labelText);
            const expenseElem = createElement(tagArr[2], optionArr[2], textArr[1]);
            return labelElem + expenseElem;
          };
          // HTML Expense Card ELEMENTS
          const expenseCardTitle = createElement('h6', titleOption, expenseObject.type);
          const expenseDescriptionElem = createCardTextElems(htmlTagsArr, htmlOptionsArr, ['Description', expenseObject.description]);
          const expenseDateElem = createCardTextElems(htmlTagsArr, htmlOptionsArr, ['Date', expenseDateString]);
          const expenseRateElem = createCardTextElems(htmlTagsArr, htmlOptionsArr, ['Rate', rateText]);
          const aText = amountString + ' ' + currency_unit;
          const expenseAmountElem = createCardTextElems(htmlTagsArr, htmlOptionsArr, [amountLabelText, aText]);
          const acText = amountConvertedString + ' ' + travelObject.homeCurrency;
          const expenseAmountConvertedElem = createCardTextElems(htmlTagsArr, htmlOptionsArr, ['Amount', acText]);
          const expenseBodyElements = expenseCardTitle + expenseDateElem + expenseDescriptionElem + expenseAmountElem + expenseRateElem + expenseAmountConvertedElem;
          const expenseCardBody = createElement('div', {class:'card-body', id:`heading${expenseId}_CardBody`},  expenseBodyElements);
          const expenseCard = createElement('div', {class:['card', 'text-white', 'bg-secondary', 'mx-2', 'my-2', 'border-warning'], id:`expense_${expenseId}_Card`},  expenseCardBody);
          expenseObjectsArray.push(expenseCard);
        });
        const expenses = expenseObjectsArray.join('')
        // HTML Travel Card ELEMENTS OPTIONS
        const travelButtonBadgeOptions = {class: 'badge badge-warning mx-1'};
        /*
         * travelButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
         * if else statement where checks class.indexOf(class)
         */
        const travelButtonShowOptions = {
          class: ['badge', 'badge-secondary', 'text-warning'],
          type: 'button',
          data_toggle: 'collapse',
          data_target: `#collapse${travelId}`,
          aria_expanded: 'true',
          aria_controls: `collapse${travelId}`,
          data_text_swap: 'hide',
          data_text_original: 'show',
          data_text_badge: `${expensesCount}`,
          data_text_badge_sr: 'expenses count in travel',
          onclick: 'toggleTravelButtonText(event)',
          style: 'width: 70px'
        }
        const travelButtonEditOptions = {
          class: ['badge', 'badge-secondary', 'text-white'],
          type: 'button',
          onclick: `location.href='${hrefTravel}'`
        }
        const travelCollapseOptions = {
          id: `collapse${travelId}`,
          class: 'collapse',
          aria_labelledby: `heading${travelId}_CardHeader`,
          // data_parent: `#travel_${travelId}Accordion`
        }
        // HTML Travel ELEMENTS
        const travelButtonBadgeSr = createElement('span', {class: 'sr-only'}, 'expenses count');
        const travelButtonBadge = createElement('span', travelButtonBadgeOptions, expensesCount);
        const travelButtonShowText = createElement('button', travelButtonShowOptions, 'show' + travelButtonBadge + travelButtonBadgeSr);
        const travelButtonShowElem = createElement('h6', {class: 'mb-0 d-inline mx-1'}, travelButtonShowText);
        const travelButtonEditText = createElement('button', travelButtonEditOptions, 'edit');
        const travelButtonEditElem = createElement('h6', {class: 'mb-0 d-inline mx-1'}, travelButtonEditText);
        const travelHeaderText = createElement('h6', {class: 'mb-1'}, `${dateFromString} ${travelObject.description}`);
        const travelHeaderElem = createElement('div', {class: ''}, travelHeaderText + travelButtonShowElem + travelButtonEditElem);
        const travelCardHeader = createElement('div', {class: 'card-header py-2'}, travelHeaderElem);
        const travelCardBody = createElement('div', {class: 'card-body'}, expenses);
        const travelCollapse = createElement('div', travelCollapseOptions, travelCardBody);
        const travelCard = createElement('div', {class: 'card  bg-secondary text-white', id: `travel_${travelId}_Card`}, travelCardHeader + travelCollapse);
        travelObjectsArray.push(travelCard);
      });
      const travels = travelObjectsArray.join("");
      // HTML Month ELEMENTS OPTIONS
      const monthButtonBadgeOptions = {class: 'badge badge-dark mx-1'};
      /*
       * monthButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
       * if else statement where checks class.indexOf(class)
       */
      const monthButtonShowOptions = {
        class: ['badge', 'badge-light', 'text-dark'],
        type: 'button',
        data_toggle: 'collapse',
        data_target: `#collapse${yearString}_${monthValue}`,
        aria_expanded: 'true',
        aria_controls: `collapse${yearString}_${monthValue}`,
        data_text_swap: 'hide',
        data_text_original: 'show',
        data_text_badge: `${monthObject.count}`,
        data_text_badge_sr: 'travels count in month',
        onclick: 'toggleTravelButtonText(event)',
        style: 'width: 70px'
      };
      const monthCollapseOptions = {
        id: `collapse${yearString}_${monthValue}`,
        class: 'collapse',
        aria_labelledby: `heading${yearString}_${monthValue}_CardHeader`,
        // data_parent: `#travels_${year}_${monthValue}Accordion`
      };
      // HTML Month ELEMENTS
      const monthButtonBadgeSr = createElement('span', {class: 'sr-only'}, 'expenses count');
      const monthButtonBadge = createElement('span', monthButtonBadgeOptions, monthObject.count);
      const monthButtonShowText = createElement('button', monthButtonShowOptions, 'show' + monthButtonBadge + monthButtonBadgeSr);
      const monthButtonShowElem = createElement('h6', {class: 'mb-0 mx-1 d-inline float-right'}, monthButtonShowText);
      const monthCardHeader = createElement('div', {class: 'card-header py-2'}, monthString + monthButtonShowElem);
      const monthCardBody = createElement('div', {class: 'card-body'}, travels);
      const monthCollapse = createElement('div', monthCollapseOptions, monthCardBody);
      const monthCard = createElement('div', {class: 'card', style: 'border: none'}, monthCardHeader + monthCollapse);
      monthObjectsArray.push(monthCard);
    });
    const months = monthObjectsArray.join('');
    // HTML Year ELEMENTS OPTIONS
    const yearButtonBadgeOptions = {class: 'badge badge-light mx-1'};
    /*
     * yearlButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
     * if else statement where checks class.indexOf(class)
     */
    const yearButtonShowOptions = {
      class: ['badge', 'badge-dark', 'text-white'],
      type: 'button',
      data_toggle: 'collapse',
      data_target: `#collapse${yearString}`,
      aria_expanded: 'false',
      aria_controls: `collapse${yearString}`,
      data_text_swap: 'hide',
      data_text_original: 'show',
      data_text_badge: `${yearObject.countTotal}`,
      data_text_badge_sr: 'travels count in month',
      onclick: 'toggleTravelButtonText(event)',
      style: 'width: 70px'
    };
    const monthsCollapseOptions = {
      id: `collapse${yearString}`,
      class: 'collapse',
      aria_labelledby: `heading${yearString}_CardHeader`
    };
    // HTML Year ELEMENTS
    const yearButtonBadgeSr = createElement('span', {class: 'sr-only'}, 'expenses count');
    const yearButtonBadge = createElement('span', yearButtonBadgeOptions, yearObject.countTotal);
    const yearButtonShowText = createElement('button', yearButtonShowOptions, 'show' + yearButtonBadge + yearButtonBadgeSr);
    const yearButtonShowElem = createElement('h6', {class: 'mb-0 mx-1 d-inline float-right'}, yearButtonShowText);
    const yearCardHeader = createElement('div', {class: 'card-header py-2', id: `heading${yearString}_CardHeader`}, yearString + yearButtonShowElem);
    const yearCardBody = createElement('div', {class: 'card-body p-0'}, months);
    const yearCollapse = createElement('div', monthsCollapseOptions, yearCardBody);
    const yearCard = createElement('div', {class: 'card'}, yearCardHeader + yearCollapse );
    yearObjectsArray.push(yearCard);
  });
  const result = createElement('div', {id: 'yearsAccordion'}, yearObjectsArray.join('\n'));
  return result;
});
