const expressHbs = require('express-hbs');
const moment = require('moment');
const createElement = require('../utils').createElement;
const createTwoCardElements = require('../utils').createTwoCardElements;


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
        const dateFromString = moment(travelObject.dateFrom).format('YYYY-MM-DD');
        const travelId = travelObject._id;
        const expensesCount = travelObject.expenses.length;
        const hrefTravel = `/travels/${travelId}`;
        const homeCurrency = travelObject.homeCurrency;
        const totalString = `${formatter.format(travelObject.total)} ${homeCurrency}`;
        const travelHeaderTextString =  `${dateFromString} ${travelObject.description} ${totalString}`;
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
          const labelTextOptions = {class:'card-text'};
          const labelOptions = {class: 'card-text text-warning mb-0'};
          const expenseOptions = {class:'card-text mb-1'};
          // TODO titleOptions, expenseCardBodyOptions & expenseCard id not needed?
          const titleOptions = {class:'card-title', id:`heading${expenseId}_CardTitle`};
          const expenseCardBodyOptions = {class:'card-body', id:`heading${expenseId}_CardBody`};
          const expenseCardOptions = {class:['card', 'text-white', 'bg-secondary', 'mx-2', 'my-2', 'border-warning'], id:`expense_${expenseId}_Card`};
          // Card Body tags and attributes for expenseObject values
          const htmlLabelTagsArr = ['small', 'p'];
          const htmlTagsArr = htmlLabelTagsArr.concat(['p']);
          const htmlOptionsArr = [labelTextOptions, labelOptions, expenseOptions];
          const htmlTagsArrTitle = htmlLabelTagsArr.concat(['h6']);
          const htmlOptionsArrTitle = [labelTextOptions, labelOptions, titleOptions];

          // HTML Expense Card ELEMENTS
          const expenseDescriptionElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Description', expenseObject.description]);
          const expenseDateElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Date', expenseDateString]);
          const expenseRateElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Rate', rateText]);
          const aText = amountString + ' ' + currency_unit;
          const expenseAmountElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [amountLabelText, aText]);
          const acText = amountConvertedString + ' ' + travelObject.homeCurrency;
          const expenseAmountConvertedElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Amount', acText]);
          const expenseTypeElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Type', expenseObject.type]);
          const expenseCardBodyTitle = expenseTypeElem;
          // const expenseCardBodyTitle = createElement('h6', titleOptions, expenseObject.type);
          const expenseBodyElements = expenseCardBodyTitle + expenseDateElem + expenseDescriptionElem + expenseAmountElem + expenseRateElem + expenseAmountConvertedElem;
          const expenseCardBody = createElement('div', expenseCardBodyOptions,  expenseBodyElements);
          const expenseCard = createElement('div', expenseCardOptions,  expenseCardBody);
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
        const travelButtonElemOptions = {class: 'mb-0 d-inline mx-1'};
        const travelHeaderTextOptions = {class: 'mb-1'};
        const travelCollapseOptions = {
          id: `collapse${travelId}`,
          class: 'collapse',
          aria_labelledby: `heading${travelId}_CardHeader`,
          // data_parent: `#travel_${travelId}Accordion`
        }
        const travelCardOptions = {
          class: 'card  bg-secondary text-white',
          id: `travel_${travelId}_Card`
        }
        // HTML Travel ELEMENTS
        const travelButtonBadgeSr = createElement('span', {class: 'sr-only'}, 'expenses count');
        const travelButtonBadge = createElement('span', travelButtonBadgeOptions, expensesCount);
        const travelButtonShowText = createElement('button', travelButtonShowOptions, 'show' + travelButtonBadge + travelButtonBadgeSr);
        const travelButtonShowElem = createElement('h6', travelButtonElemOptions, travelButtonShowText);
        const travelButtonEditText = createElement('button', travelButtonEditOptions, 'edit');
        const travelButtonEditElem = createElement('h6', travelButtonElemOptions, travelButtonEditText);
        const travelHeaderText = createElement('h6', travelHeaderTextOptions, travelHeaderTextString);
        const travelHeaderElem = createElement('div', {class: ''}, travelHeaderText + travelButtonShowElem + travelButtonEditElem);
        const travelCardHeader = createElement('div', {class: 'card-header py-2'}, travelHeaderElem);
        const travelCardBody = createElement('div', {class: 'card-body'}, expenses);
        const travelCollapse = createElement('div', travelCollapseOptions, travelCardBody);
        const travelCard = createElement('div', travelCardOptions, travelCardHeader + travelCollapse);
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
        aria_labelledby: `heading${yearString}_${monthValue}_CardHeader`
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
