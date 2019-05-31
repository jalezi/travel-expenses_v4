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

expressHbs.registerHelper('byYearAccordion', (value) => {
  const year = value._id.year;
  const byYear = value.byYear;

  // Months Collapse
  const accordionsByMonths = [];
  byYear.forEach((val, idx) => {
    const monthValue = val._id.month;
    const monthString = moment().month(monthValue-1).format("MMMM");
    const byMonth = val.byMonth;

    // Month Collapse
    const travelsByMonth = [];
    byMonth.forEach((travel) => {
      travelId = travel._id;
      const dateFrom = moment(travel.dateFrom).format('YYYY-MM-DD');
      const hrefTravel = `/travels/${travelId}`;

      // Travel Collapse
      expensesByTravel = [];
      travel.expenses.forEach((expense) => {
        const expenseId = expense._id;
        const expenseDate = expense.date;
        const expenseDateString = moment(expenseDate).format('YYYY-MM-DD');

        const expenseCardTitle = createElement('h6', {class:'card-title', id:`heading${expenseId}_CardTitle`}, expense.type);
        const expenseTypeElem = createElement('p', {class:'card-text'}, expense.description);
        const expenseDateElem = createElement('p', {class:'card-text'}, expenseDateString);
        const expenseBodyElements = expenseCardTitle + expenseDateElem + expenseTypeElem;

        const expenseCardBody = createElement('div', {class:'card-body', id:`heading${expenseId}_CardBody`},  expenseBodyElements);
        const expenseCard = createElement('div', {class:['card', 'mx-2', 'my-2'], id:`expense_${expenseId}_Card`},  expenseCardBody);
        expensesByTravel.push(expenseCard);
      });

      // Travel Card
      const travelButtonOptions = {
        class: ['btn', 'btn-secondary'],
        type: 'button',
        data_toggle: 'collapse',
        data_target: `#collapse${travelId}`,
        aria_expanded: 'true',
        aria_controls: `collapse${travelId}`
      }
      const travelButton = createElement('button', travelButtonOptions, `${dateFrom} ${travel.description}`);
      const travelAttr = createElement('h6', {class: 'mb-0'}, travelButton);
      const travelCardHeader = createElement('div', {class: 'card-header', id: `heading${travelId}_CardHeader`}, travelAttr);

      const travelCollapseOptions = {
        id: `collapse${travelId}`,
        class: 'collapse',
        aria_labelledby: `heading${travelId}_CardHeader`,
        data_parent: `#travel_${travelId}Accordion`
      }
      const travelCollapse = createElement('div', travelCollapseOptions, expensesByTravel.join(""));
      const travelCard = createElement('div', {class: 'card', id: `travel_${travelId}_Card`}, travelCardHeader + travelCollapse);
      // Travel Accordion
      const travelAccordion = createElement('div', {class: 'accordion', id: `travel_${travelId}Accordion`}, travelCard);
      travelsByMonth.push(travelAccordion);
    });

    const monthCollapseOptions = {
      id: `collapse${year}_${monthValue}`,
      class: 'collapse',
      aria_labelledby: `heading${year}_${monthValue}_CardHeader`,
      data_parent: `#travels_${year}_${monthValue}Accordion`
    };
    const monthCollapse = createElement('div', monthCollapseOptions, travelsByMonth.join(""));

    // Month Card
    const monthButtonOptions = {
      class: ['btn', 'btn-light'],
      type: 'button',
      data_toggle: 'collapse',
      data_target: `#collapse${year}_${monthValue}`,
      aria_expanded: 'true',
      aria_controls: `collapse${year}_${monthValue}`
    };
    const monthButton = createElement('button', monthButtonOptions, monthString);
    const monthAttr = createElement('h5', {class: 'mb-0'}, monthButton);
    const monthCardHeader = createElement('div', {class: 'card-header', id: `heading${year}_${monthValue}_CardHeader`}, monthAttr);
    const monthCard = createElement('div', {class: 'card', id: `month_${year}_${monthValue}_Card`}, monthCardHeader + monthCollapse);

    // Month Accordion
    const accordionByMonth = createElement('div', {class: 'accordion', id: `travels_${year}_${monthValue}Accordion`}, monthCard);
    accordionsByMonths.push(accordionByMonth);
  });

  // Year Card
  const yearButtonOptions = {
    class: ['btn', 'btn-dark'],
    type: 'button',
    data_toggle: 'collapse',
    data_target: `#collapse${year}`,
    aria_expanded: 'true',
    aria_controls: `collapse${year}`
  };
  const yearButton = createElement('button', yearButtonOptions, year);
  const yearAttr = createElement('h5', {class: 'mb-0'}, yearButton);
  const yearCardHeader = createElement('div', {class: 'card-header', id: `heading${year}_CardHeader`}, yearAttr);
  const monthsCollapseOptions = {
    id: `collapse${year}`,
    class: 'collapse',
    aria_labelledby: `heading${year}_CardHeader`,
    data_parent: `#travelsAccordion`
  };
  const monthsCollapse = createElement('div', monthsCollapseOptions, accordionsByMonths.join(""));
  const yearCard = createElement('div', {class: 'card', id: `${year}_Card`}, yearCardHeader + monthsCollapse);

  return yearCard;
});
