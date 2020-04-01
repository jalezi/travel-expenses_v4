const expressHbs = require('express-hbs');
const moment = require('moment');

const { createElement } = require('../utils');
const { createTwoCardElements, createOptions } = require('../utils');
const { expenseTypes } = require('../../lib/globals');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('yearsAccordion');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\hbsHelpers\\yearsAccordion INITIALIZING!');

/*
 Returns expense curRate object

 Couldn't populate on travel aggregate expense curRate.
 Travel Object has new array with unique curRate objects.
 */
const findCurRate = (travel, expense) => {
  logger.silly('findCurRate');
  let curRate;
  if (expense.type !== 'Mileage') {
    curRate = travel.curRates.find(
      cr => cr._id.toString() === expense.curRate.toString()
    );
  } else {
    curRate = false;
  }
  return curRate;
};


// const createFormRow = () => {

// }

/*
 creates Expense Form
 */
// eslint-disable-next-line no-unused-vars
const createExpenseForm = (
  travel,
  expense,
  formatter,
  method = 'POST',
  hiddenMethod = method,
  csrf = '',
  expenseTypes = {}
) => {
  logger.silly('createExpenseForm');
  if (!travel || !expense) {
    return;
  }

  const curRate = findCurRate(travel, expense);
  const mileage = expense.type === 'Mileage';

  method = method.toUpperCase();
  hiddenMethod = hiddenMethod.toUpperCase();

  // hidden INPUT OPTIONS
  const hiddenInputOptions = {
    type: 'hidden',
    name: '_csrf',
    value: csrf
  };

  const hiddenInputOptions2 = {
    type: 'hidden',
    name: '_method',
    value: hiddenMethod
  };

  // div row OPTIONS
  const divRowOptions = { class: 'form-group my-1', style: '' };
  const divElemOptions = {};

  // label TAGS & OPTIONS, form elements OPTIONS
  const htmlLabelTagsArr = ['small', 'label'];
  const labelTextOptions = { class: 'form-label' };
  const labelOptions = { class: ['text-warning', 'mb-0'] };
  const htmlLabelOptionsArr = [labelTextOptions, labelOptions];
  const elemOptions = {
    class: ['form-control', 'mb-1', 'bg-secondary', 'text-white', 'text-right'],
    autofocus: 'autofocus',
    required: 'required',
    style: '',
    readonly: 'readonly'
  };

  // ALWAYS SHOW
  // EXPENSE.TYPE - HTML SELECT
  // expense type INPUT OPTIONS
  labelOptions.for = `expenseType${expense._id}`;
  elemOptions.id = `expenseType${expense._id}`;
  elemOptions.name = 'expenseType';
  elemOptions.autocomplete = 'expenseType';

  // expense type INPUT TAGS & OPTONS
  const htmlTagsArr = htmlLabelTagsArr.concat(['select']);
  htmlLabelOptionsArr[1] = labelOptions;
  const htmlOptionsArr = htmlLabelOptionsArr.concat([elemOptions]);

  // expense type INPUT ELEMENT
  const typeOptionElem = createOptions(expenseTypes, expense.type);
  const typeElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [
    'Type',
    typeOptionElem
  ]);
  const typeElemDiv = createElement('div', divElemOptions, typeElem);
  const typeElemRow = createElement('div', divRowOptions, typeElemDiv);
  delete elemOptions.autocomplete;

  // EXPENSE.DESCRIPTION - HTML INPUT text
  // expense description INPUT OPTIONS
  labelOptions.for = `expenseDescription${expense._id}`;
  elemOptions.type = 'text';
  elemOptions.id = `expenseDescription${expense._id}`;
  elemOptions.name = 'expenseDescription';
  elemOptions.autocomplete = 'expenseDescription';
  elemOptions.value = expense.description;

  // expense description INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  const descriptionClosingTags = [true, true, false];

  // expense description INPUT ELEMENT
  const descriptionElem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    ['Description', ''],
    descriptionClosingTags
  );
  const descriptionElemDiv = createElement(
    'div',
    divElemOptions,
    descriptionElem
  );
  const descriptionElemRow = createElement(
    'div',
    divRowOptions,
    descriptionElemDiv
  );
  delete elemOptions.value;
  delete elemOptions.type;

  // EXPENSE.DATE - HTML INPUT date
  // expense date INPUT OPTIONS
  labelOptions.for = `invoiceDate${expense._id}`;
  elemOptions.type = 'date';
  elemOptions.id = `invoiceDate${expense._id}`;
  elemOptions.name = 'invoiceDate';
  elemOptions.autocomplete = 'invoiceDate';
  elemOptions.value = moment(expense.date).format('YYYY-MM-DD');
  elemOptions.min = moment(travel.dateFrom).format('YYYY-MM-DD');
  elemOptions.max = moment(travel.dateTo).format('YYYY-MM-DD');
  // elemOptions.style =  elemOptions.style + '-webkit-text-fill-color: white;';

  // expense date INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  const dateClosingTags = [true, true, false];

  // expense date INPUT ELEMENT
  const dateElem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    ['Date', ''],
    dateClosingTags
  );
  const dateElemDiv = createElement('div', divElemOptions, dateElem);
  const dateElemRow = createElement('div', divRowOptions, dateElemDiv);
  delete elemOptions.value;
  delete elemOptions.type;
  delete elemOptions.min;
  delete elemOptions.max;
  // elemOptions.style.replace('-webkit-text-fill-color: white;', '');

  // NOT MILEAGE
  // EXPENSE.CURRENCY - HTML INPUT text
  // expense currency INPUT OPTIONS
  labelOptions.for = `invoiceCurrency${expense._id}`;
  elemOptions.class.push('text-to-upper');
  elemOptions.type = 'text';
  elemOptions.id = `invoiceCurrency${expense._id}`;
  elemOptions.list = `currencies${expense._id}`;
  elemOptions.name = 'invoiceCurrency';
  elemOptions.autocomplete = 'invoiceCurrency';
  elemOptions.placeholder = 'USD';
  elemOptions.minLength = '3';
  elemOptions.maxlength = '3';
  elemOptions.value = !mileage ? expense.currency : '';
  elemOptions.required = !mileage ? 'required' : '';

  // expense currency INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  const currencyClosingTags = [true, true, false];

  const currencyOptionElem = createOptions(
    ['USD', 'EUR', 'RSD', 'HRK', 'BAM'],
    elemOptions.value,
    { class: 'currency' }
  );
  const currencyDatalistElem = createElement(
    'datalist',
    { class: 'currencies', id: `currencies${expense._id}` },
    currencyOptionElem
  );
  const currencyElem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    ['Currency', currencyDatalistElem],
    currencyClosingTags
  );
  const currencyElemDiv = createElement('div', divElemOptions, currencyElem);
  const currencyElemRow = createElement('div', divRowOptions, currencyElemDiv);
  elemOptions.class.pop();
  delete elemOptions.placeholder;
  delete elemOptions.minLength;
  delete elemOptions.maxlength;
  delete elemOptions.value;
  elemOptions.required = 'required';

  // EXPENSE.RATE - HTML INPUT number
  // expense rate INPUT OPTIONS
  labelOptions.for = `rate${expense._id}`;
  elemOptions.type = 'number';
  elemOptions.id = `rate${expense._id}`;
  elemOptions.name = 'rate';
  elemOptions.autocomplete = 'rate';
  elemOptions.step = '0.01';
  elemOptions.placeholder = '0.00';
  elemOptions.value = !mileage ? curRate.rate[expense.currency].toString() : '';
  elemOptions.min = 0;
  // divRowOptions.style = `display: ${(mileage) ? 'none' : 'initial'}`;

  // expense rate INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  const rateClosingTags = [true, true, false];

  const rateElem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    ['Rate', ''],
    rateClosingTags
  );
  const rateElemDiv = createElement('div', divElemOptions, rateElem);
  const rateElemRow = createElement('div', divRowOptions, rateElemDiv);
  delete elemOptions.placeholder;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.value;
  // delete divRowOptions.style;

  // EXPENSE.AMOUNT - HTML INPUT number
  // expense amount INPUT OPTIONS
  labelOptions.for = `amount${expense._id}`;
  elemOptions.type = 'number';
  elemOptions.id = `amount${expense._id}`;
  elemOptions.name = 'amount';
  elemOptions.autocomplete = 'amount';
  elemOptions.step = '0.01';
  elemOptions.placeholder = '0.00';
  elemOptions.value = !mileage ? Number(expense.amount).toFixed(2) : '';
  elemOptions.min = 0;

  // expense amount INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  const amountClosingTags = [true, true, false];

  const amountElem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    ['Amount', ''],
    amountClosingTags
  );
  const amountElemDiv = createElement('div', divElemOptions, amountElem);
  const amountElemRow = createElement('div', divRowOptions, amountElemDiv);
  delete elemOptions.placeholder;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.value;

  // EXPENSE.AMOUNTCONVERTED - HTML INPUT number
  // expense amountConverted INPUT OPTIONS
  labelOptions.for = `amountConverted${expense._id}`;
  labelOptions.class.push('input-group');
  elemOptions.type = 'number';
  elemOptions.id = `amountConverted${expense._id}`;
  elemOptions.name = 'amountConverted';
  elemOptions.autocomplete = 'amountConverted';
  elemOptions.placeholder = '0.00';
  elemOptions.value = !mileage
    ? Number(expense.amountConverted).toFixed(2)
    : '';
  elemOptions.min = 0;
  elemOptions.class.push('input-group');
  elemOptions.readonly = 'readonly';
  divElemOptions.class = ['input-group'];

  // expense amountConverted INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  const amountConvertedClosingTags = [true, true, false];
  const prependElemSpan = createElement(
    'span',
    {
      class: 'input-group-text mb-1 text-white bg-secondary',
      id: `currency-addon${expense._id}`
    },
    travel.homeCurrency
  );
  const prependElemDiv = createElement(
    'div',
    { class: 'input-group-prepend' },
    prependElemSpan
  );

  const amountConvertedElem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    ['Amount Converted', ''],
    amountConvertedClosingTags,
    prependElemDiv
  );
  const amountConvertedElemDiv = createElement(
    'div',
    divElemOptions,
    amountConvertedElem
  );
  const amountConvertedElemRow = createElement(
    'div',
    divRowOptions,
    amountConvertedElemDiv
  );
  delete elemOptions.placeholder;
  delete elemOptions.min;
  delete elemOptions.value;
  elemOptions.class.pop();
  delete elemOptions.readonly;
  delete divElemOptions.class;

  const notMileageDivOptions = {
    class: '',
    id: `notMileage${expense._id}`,
    style: `display: ${mileage ? 'none' : 'initial'}`
  };

  // MILEAGE
  // eslint-disable-next-line no-unused-vars
  const aDistanceId = `amountDistance${expense._id}`;
  // eslint-disable-next-line no-unused-vars
  const aDistance2Id = `amountDistance2${expense._id}`;
  const aDistanceRowId = `amountDistanceRow${expense._id}`;
  const aDistanceRow2Id = `amountDistance2Row${expense._id}`;

  // EXPENSE.UNIT - HTML SELECT
  labelOptions.for = `invoiceUnit${expense._id}`;
  elemOptions.id = `invoiceUnit${expense._id}`;
  elemOptions.name = 'invoiceUnit';
  elemOptions.autocomplete = 'invoiceUnit';
  elemOptions.onchange = 'invoiceUnitChange(event)';

  // expense type INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'select';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;

  // expense type INPUT ELEMENT
  const unitOptionElem = createOptions(['mi', 'km'], expense.unit);
  const unitElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [
    'Unit',
    unitOptionElem
  ]);
  const unitElemDiv = createElement('div', divElemOptions, unitElem);
  const unitElemRow = createElement('div', divRowOptions, unitElemDiv);
  delete elemOptions.autocomplete;
  delete elemOptions.onchange;

  // EXPENSE.PERMILEAMOUNT - HTML INPUT number
  labelOptions.for = `travelPerMileAmount${expense._id}`;
  elemOptions.id = `travelPerMileAmount${expense._id}`;
  elemOptions.name = 'travelPerMileAmount';
  elemOptions.autocomplete = 'travelPerMileAmount';
  elemOptions.type = 'number';
  elemOptions.value = mileage ? Number(travel.perMileAmount).toFixed(2) : '';
  elemOptions.step = '0.01';
  elemOptions.min = 0;
  elemOptions.placeholder = '0.00';
  elemOptions.readonly = 'readonly';

  // expense type INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;

  // expense type INPUT ELEMENT
  // TODO link userHomeDistance to user model
  const userHomeDistance = 'mi';
  const labelPerMileAmountText = `${travel.homeCurrency}/${userHomeDistance}`;
  const perMileAmountElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [
    labelPerMileAmountText,
    ''
  ]);
  const perMileAmountElemDiv = createElement(
    'div',
    divElemOptions,
    perMileAmountElem
  );
  const perMileAmountElemRow = createElement(
    'div',
    divRowOptions,
    perMileAmountElemDiv
  );
  delete elemOptions.autocomplete;
  delete elemOptions.type;
  delete elemOptions.value;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.placeholder;
  delete elemOptions.readonly;

  // EXPENSE.AMOUNTDISTANCE - HTML INPUT number
  labelOptions.for = `amountDistance${expense._id}`;
  elemOptions.id = `amountDistance${expense._id}`;
  elemOptions.name = 'amountDistance';
  elemOptions.autocomplete = 'amountDistance';
  elemOptions.type = 'number';
  elemOptions.value = mileage ? Number(expense.amount).toFixed(2) : '';
  elemOptions.step = '0.01';
  elemOptions.min = 0;
  elemOptions.placeholder = '0.00';
  divRowOptions.id = aDistanceRowId;

  // expense type INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;

  // expense type INPUT ELEMENT
  const labelAmountDistanceText = `Distance[${userHomeDistance}]`;
  const amountDistanceElem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    [labelAmountDistanceText, '']
  );
  const amountDistanceElemDiv = createElement(
    'div',
    divElemOptions,
    amountDistanceElem
  );
  const amountDistanceElemRow = createElement(
    'div',
    divRowOptions,
    amountDistanceElemDiv
  );
  delete elemOptions.autocomplete;
  delete elemOptions.type;
  delete elemOptions.value;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.placeholder;
  delete divRowOptions.id;

  // EXPENSE.AMOUNTCONVERTED2 - HTML INPUT number
  // expense amountConverted2 INPUT OPTIONS
  labelOptions.for = `amountConverted2${expense._id}`;
  labelOptions.class.push('input-group');
  elemOptions.type = 'number';
  elemOptions.id = `amountConverted2${expense._id}`;
  elemOptions.name = 'amountConverted2';
  elemOptions.autocomplete = 'amountConverted2';
  elemOptions.placeholder = '0.00';
  elemOptions.value = mileage ? Number(expense.amountConverted).toFixed(2) : '';
  elemOptions.min = 0;
  elemOptions.class.push('input-group');
  elemOptions.readonly = 'readonly';
  divElemOptions.class = ['input-group'];

  // expense amountConverted INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  const amountConverted2ClosingTags = [true, true, false];
  const prependElemSpan2 = createElement(
    'span',
    {
      class: 'input-group-text mb-1 text-white bg-secondary',
      id: `currency-addon2${expense._id}`
    },
    travel.homeCurrency
  );
  const prependElemDiv2 = createElement(
    'div',
    { class: 'input-group-prepend' },
    prependElemSpan2
  );

  const amountConverted2Elem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    ['Amount Converted', ''],
    amountConverted2ClosingTags,
    prependElemDiv2
  );
  const amountConverted2ElemDiv = createElement(
    'div',
    divElemOptions,
    amountConverted2Elem
  );
  const amountConverted2ElemRow = createElement(
    'div',
    divRowOptions,
    amountConverted2ElemDiv
  );
  delete elemOptions.placeholder;
  delete elemOptions.min;
  delete elemOptions.value;
  elemOptions.class.pop();
  delete elemOptions.readonly;
  delete divElemOptions.class;

  // EXPENSE.AMOUNTDISTANCE2 - HTML INPUT number
  const userHomeDistance2 = userHomeDistance === 'mi' ? 'km' : 'mi';
  labelOptions.for = `amountDistance2${expense._id}`;
  elemOptions.id = `amountDistance2${expense._id}`;
  elemOptions.name = 'amountDistance2';
  elemOptions.autocomplete = 'amountDistance2';
  elemOptions.type = 'number';
  // elemOptions.value = (mileage) ? Number(expense.amount).toFixed(2) : '';
  elemOptions.step = '0.01';
  elemOptions.min = 0;
  elemOptions.placeholder = '0.00';
  elemOptions.readonly = 'readonly';
  divRowOptions.style += 'display: none;';
  divRowOptions.id = aDistanceRow2Id;

  // expense type INPUT TAGS & OPTONS
  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;

  // expense type INPUT ELEMENT
  const labelAmountDistance2Text = `Distance[${userHomeDistance2}]`;
  const amountDistance2Elem = createTwoCardElements(
    htmlTagsArr,
    htmlOptionsArr,
    [labelAmountDistance2Text, '']
  );
  const amountDistance2ElemDiv = createElement(
    'div',
    divElemOptions,
    amountDistance2Elem
  );
  const amountDistance2ElemRow = createElement(
    'div',
    divRowOptions,
    amountDistance2ElemDiv
  );
  delete elemOptions.autocomplete;
  delete elemOptions.type;
  // delete elemOptions.value;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.placeholder;
  delete elemOptions.readonly;
  divRowOptions.style.replace('display: none;', '');
  delete divRowOptions.id;

  const expenseButtonEditOptions = {
    class: ['badge', 'badge-secondary', 'text-white'],
    type: 'button',
    onclick: 'editExpense(event)'
  };
  const expenseButtonElemOptions = { class: 'mb-0 d-inline mx-1' };
  const expenseButtonEditText = createElement(
    'button',
    expenseButtonEditOptions,
    'edit'
  );
  const expenseButtonEditElem = createElement(
    'h6',
    expenseButtonElemOptions,
    expenseButtonEditText
  );

  const mileageDivOptions = {
    class: '',
    id: `mileage${expense._id}`,
    style: `display: ${mileage ? 'initial' : 'none'}`
  };

  const formOptions = {
    action: `/travels/${travel._id}/expenses/${expense._id}`,
    method,
    id: `expenseForm${expense._id}`
  };

  const hiddenInputCsrf = createElement('input', hiddenInputOptions, '', false);
  const hiddenInputMethod = createElement('input', hiddenInputOptions2, '', false);
  const alwaysShowElem = typeElemRow + descriptionElemRow + dateElemRow;
  const formAlwaysShowDiv = createElement(
    'div',
    { class: '', id: `alwaysShow${expense._id}` },
    alwaysShowElem
  );
  const formNotMIleageElem =
    currencyElemRow + rateElemRow + amountElemRow + amountConvertedElemRow;
  const formNotMileageDiv = createElement(
    'div',
    notMileageDivOptions,
    formNotMIleageElem
  );
  const formMileageElem =
    unitElemRow +
    perMileAmountElemRow +
    amountDistanceElemRow +
    amountDistance2ElemRow +
    amountConverted2ElemRow;
  const formMileageDiv = createElement(
    'div',
    mileageDivOptions,
    formMileageElem
  );
  const formElements =
    hiddenInputCsrf +
    hiddenInputMethod +
    formAlwaysShowDiv +
    formNotMileageDiv +
    formMileageDiv +
    expenseButtonEditElem;
  const form = createElement('form', formOptions, formElements);
  return form;
};

/*
 Returns HTML elements
 @param value Array with travels mongo aggregate group
 by year and each year group by month

 More in Travel Schema /models/Travel.js Travel.byYear_byMonth
 */
expressHbs.registerHelper('yearsAccordionWithForm', (value, csrf) => {
  logger.debug('yearsAccordionWithForm START');
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  // HTML Accordion - RESULT
  const yearObjectsArray = [];
  value.forEach(yearObject => {
    const yearString = yearObject._id.year.toString();
    // HTML Year Card COLLAPSE - BODY
    const monthObjectsArray = [];
    yearObject.byYear.forEach(monthObject => {
      const monthValue = monthObject._id.month - 1;
      const monthString = moment()
        .month(monthValue)
        .format('MMMM');
      const travelObjectsArray = [];
      // HTML Month Card COLLAPSE - BODY
      monthObject.byMonth.forEach(travelObject => {
        const dateFromString = moment(travelObject.dateFrom).format(
          'YYYY-MM-DD'
        );
        const travelId = travelObject._id;
        const expensesCount = travelObject.expenses.length;
        const hrefTravel = `/travels/${travelId}`;
        const { homeCurrency } = travelObject;
        const totalString = `${formatter.format(
          travelObject.total
        )} ${homeCurrency}`;
        const travelHeaderTextString = `${dateFromString} ${travelObject.description} ${totalString}`;
        // HTML Travel Card COLLAPSE - BODY
        const expenseObjectsArray = [];
        travelObject.expenses.forEach(expenseObject => {
          const expenseId = expenseObject._id;

          const expenseCardBodyOptions = {
            class: 'card-body',
            id: `heading${expenseId}_CardBody`
          };
          const expenseCardOptions = {
            class: [
              'card',
              'text-white',
              'bg-secondary',
              'mx-2',
              'my-2',
              'border-warning'
            ],
            id: `expense_${expenseId}_Card`
          };

          const form = createExpenseForm(
            travelObject,
            expenseObject,
            formatter,
            'post',
            'patch',
            csrf,
            expenseTypes
          );
          const expenseCardBody = createElement(
            'div',
            expenseCardBodyOptions,
            form
          );
          const expenseCard = createElement(
            'div',
            expenseCardOptions,
            expenseCardBody
          );
          expenseObjectsArray.push(expenseCard);
        });
        const expenses = expenseObjectsArray.join('');
        // HTML Travel Card ELEMENTS OPTIONS
        const travelButtonBadgeOptions = { class: 'badge badge-warning mx-1' };
        /**
         * travelButtonShowOptions's class badge-secondary is related
         * to toggleTravelButtonText() in home.hbs
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
        };
        const travelButtonEditOptions = {
          class: ['badge', 'badge-secondary', 'text-white'],
          type: 'button',
          onclick: `location.href='${hrefTravel}'`
        };
        const travelButtonElemOptions = { class: 'mb-0 d-inline mx-1' };
        const travelHeaderTextOptions = { class: 'mb-1' };
        const travelCollapseOptions = {
          id: `collapse${travelId}`,
          class: 'collapse',
          aria_labelledby: `heading${travelId}_CardHeader`
          // data_parent: `#travel_${travelId}Accordion`
        };
        const travelCardOptions = {
          class: 'card  bg-secondary text-white',
          id: `travel_${travelId}_Card`
        };
        // HTML Travel ELEMENTS
        const travelButtonBadgeSr = createElement(
          'span',
          { class: 'sr-only' },
          'expenses count'
        );
        const travelButtonBadge = createElement(
          'span',
          travelButtonBadgeOptions,
          expensesCount
        );
        const travelButtonShowText = createElement(
          'button',
          travelButtonShowOptions,
          `show${travelButtonBadge}${travelButtonBadgeSr}`
        );
        const travelButtonShowElem = createElement(
          'h6',
          travelButtonElemOptions,
          travelButtonShowText
        );
        const travelButtonEditText = createElement(
          'button',
          travelButtonEditOptions,
          'edit'
        );
        const travelButtonEditElem = createElement(
          'h6',
          travelButtonElemOptions,
          travelButtonEditText
        );
        const travelHeaderText = createElement(
          'h6',
          travelHeaderTextOptions,
          travelHeaderTextString
        );
        const travelHeaderElem = createElement(
          'div',
          { class: '' },
          travelHeaderText + travelButtonShowElem + travelButtonEditElem
        );
        const travelCardHeader = createElement(
          'div',
          { class: 'card-header py-2' },
          travelHeaderElem
        );
        const travelCardBody = createElement(
          'div',
          { class: 'card-body' },
          expenses
        );
        const travelCollapse = createElement(
          'div',
          travelCollapseOptions,
          travelCardBody
        );
        const travelCard = createElement(
          'div',
          travelCardOptions,
          travelCardHeader + travelCollapse
        );
        travelObjectsArray.push(travelCard);
      });
      const travels = travelObjectsArray.join('');
      // HTML Month ELEMENTS OPTIONS
      const monthButtonBadgeOptions = { class: 'badge badge-dark mx-1' };
      /**
       * monthButtonShowOptions's class badge-secondary is related
       * to toggleTravelButtonText() in home.hbs
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
      const monthButtonBadgeSr = createElement(
        'span',
        { class: 'sr-only' },
        'expenses count'
      );
      const monthButtonBadge = createElement(
        'span',
        monthButtonBadgeOptions,
        monthObject.count
      );
      const monthButtonShowText = createElement(
        'button',
        monthButtonShowOptions,
        `show${monthButtonBadge}${monthButtonBadgeSr}`
      );
      const monthButtonShowElem = createElement(
        'h6',
        { class: 'mb-0 mx-1 d-inline float-right' },
        monthButtonShowText
      );
      const monthCardHeader = createElement(
        'div',
        { class: 'card-header py-2' },
        monthString + monthButtonShowElem
      );
      const monthCardBody = createElement(
        'div',
        { class: 'card-body' },
        travels
      );
      const monthCollapse = createElement(
        'div',
        monthCollapseOptions,
        monthCardBody
      );
      const monthCard = createElement(
        'div',
        { class: 'card', style: 'border: none' },
        monthCardHeader + monthCollapse
      );
      monthObjectsArray.push(monthCard);
    });
    const months = monthObjectsArray.join('');
    // HTML Year ELEMENTS OPTIONS
    const yearButtonBadgeOptions = { class: 'badge badge-light mx-1' };
    /**
     * yearButtonShowOptions's class badge-secondary is related
     * to toggleTravelButtonText() in home.hbs
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
    const yearButtonBadgeSr = createElement(
      'span',
      { class: 'sr-only' },
      'expenses count'
    );
    const yearButtonBadge = createElement(
      'span',
      yearButtonBadgeOptions,
      yearObject.countTotal
    );
    const yearButtonShowText = createElement(
      'button',
      yearButtonShowOptions,
      `show${yearButtonBadge}${yearButtonBadgeSr}`
    );
    const yearButtonShowElem = createElement(
      'h6',
      { class: 'mb-0 mx-1 d-inline float-right' },
      yearButtonShowText
    );
    const yearCardHeader = createElement(
      'div',
      { class: 'card-header py-2', id: `heading${yearString}_CardHeader` },
      yearString + yearButtonShowElem
    );
    const yearCardBody = createElement(
      'div',
      { class: 'card-body p-0' },
      months
    );
    const yearCollapse = createElement(
      'div',
      monthsCollapseOptions,
      yearCardBody
    );
    const yearCard = createElement(
      'div',
      { class: 'card' },
      yearCardHeader + yearCollapse
    );
    yearObjectsArray.push(yearCard);
  });
  const result = createElement(
    'div',
    { id: 'yearsAccordion' },
    yearObjectsArray.join('\n')
  );
  logger.debug('yearsAccordionWithForm END');
  return result;
});
