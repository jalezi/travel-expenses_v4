const Rate = require('../models/Rate');

const convertRateToHomeCurrencyRate = (rates, homeCurrency, invoiceCurrency) => {
  homeCurrency = homeCurrency.toUpperCase();
  invoiceCurrency = invoiceCurrency.toUpperCase();
  // eslint-disable-next-line security/detect-object-injection
  const homeCurrencyRate = rates[homeCurrency];
  const convertedRate = 1 / homeCurrencyRate;
  // eslint-disable-next-line security/detect-object-injection
  const baseRate = rates[invoiceCurrency];
  const invoiceRate = Number((baseRate * convertedRate).toFixed(2));
  return invoiceRate;
};

const findRatesByExactOrClosestDate = async (date = new Date()) => {
  try {
    const exactDate = await Rate.find({ date }, (err, items) => items);
    if (exactDate.length === 1) {
      return exactDate[0];
    }

    const greaterDate = await Rate.findOne({ date: { $gt: date } },
      (err, item) => item)
      .sort({ date: 1 });

    const lowerDate = await Rate.findOne({ date: { $lt: date } },
      (err, item) => item)
      .sort({ date: -1 });

    if (greaterDate && lowerDate) {
      const diffGreater = Math.abs(date.getTime() - greaterDate.date.getTime());
      const diffLower = Math.abs(date.getTime() - lowerDate.date.getTime());

      if (diffGreater < diffLower) {
        return greaterDate;
      }
      return lowerDate;
    } if (!greaterDate && !lowerDate) {
      return 'FUCK!';
    } if (greaterDate) {
      return greaterDate;
    } if (lowerDate) {
      return lowerDate;
    }
    return 'FUCK AGAIN!';
  } catch (err) {
    return err;
  }
};

const toTitleCase = (str) => str.replace(/\w\S*/g,
  (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

// eslint-disable-next-line max-len
// String.prototype.splice = (idx, rem, str) => this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));

/*
 * Creates HTML elements
 * @param {string} tag
 * @param {object} options
 * @param {string} text
 * @param {boolean} closingTag
 */
const createElement = (tag, options = {}, text = 'Hello World', closingTag = true) => {
  let tagStart = `<${tag}>`;
  const tagEnd = `</${tag}>`;
  let attrs = '';
  let result = '';
  const insertIndex = tagStart.length - 1;
  const attrArray = [' '];


  // eslint-disable-next-line no-restricted-syntax
  for (let [attr, val] of Object.entries(options)) { // eslint-disable-line prefer-const
    attr = attr.replace(/_/g, '-');
    const arr = [];
    if (val instanceof Array) {
      val.forEach((val1) => {
        const val2 = `${val1} `;
        arr.push(val2);
      });
    } else {
      arr.push(val);
    }
    const rAttr = arr.join('');
    const lAttr = `${attr}="${rAttr}"`;
    attrArray.push(lAttr);
  }
  attrs = attrArray.join(' ');
  tagStart = tagStart.splice(insertIndex, 0, attrs);
  if (closingTag) {
    result = tagStart + text + tagEnd;
  } else {
    result = tagStart + text;
  }
  return result;
};

/*
 * Returns 2 HTML elements as one string
 */
const createTwoCardElements = (tagArr, optionArr, textArr = ['', ''], closingArr = [true, true, true], insert = '') => {
  const labelText = createElement(tagArr[0], optionArr[0], textArr[0], closingArr[0]);
  const labelElem = createElement(tagArr[1], optionArr[1], labelText, closingArr[1]);
  const expenseElem = createElement(tagArr[2], optionArr[2], textArr[1], closingArr[2]);
  return labelElem + insert + expenseElem;
};

const createOptions = (options, selected, elemAttrs = {}, valueToLowerCase = false) => {
  let result = '';
  selected = (!selected) ? '' : selected;
  options.forEach((val) => {
    // console.log(val);
    const optionVal = (valueToLowerCase) ? val.toLowerCase() : val;
    // console.log(optionVal, val, selected);
    elemAttrs.value = optionVal;
    if (optionVal.toLowerCase() === selected.toLowerCase()) {
      elemAttrs.selected = 'selected';
    }
    const htmlElem = createElement('option', elemAttrs, val);
    if (elemAttrs.selected) {
      delete elemAttrs.selected;
    }
    result += htmlElem;
  });
  delete elemAttrs.value;
  return result;
};

module.exports = {
  convertRateToHomeCurrencyRate,
  findRatesByExactOrClosestDate,
  toTitleCase,
  createElement,
  createTwoCardElements,
  createOptions
};
