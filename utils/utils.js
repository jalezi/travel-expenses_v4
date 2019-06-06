const Rate = require('../models/Rate');

const convertRateToHomeCurrencyRate = (rates, homeCurrency, invoiceCurrency) => {
  homeCurrency = homeCurrency.toUpperCase();
  invoiceCurrency = invoiceCurrency.toUpperCase();
  const homeCurrencyRate = rates[homeCurrency];
  const convertedRate = 1 / homeCurrencyRate;
  const baseRate = rates[invoiceCurrency];
  const invoiceRate = Number((baseRate * convertedRate).toFixed(2));
  return invoiceRate;
}

const findRatesByExactOrClosestDate = async (date = new Date()) => {
  try {
    const exactDate = await Rate.find({date: date}, (err, items) => {
      return items;
    });
    if (exactDate.length === 1) {
      return exactDate[0];
    }

    const greaterDate = await Rate.findOne({date: {$gt: date}}, (err, item) => {
      return item;
    }).sort({date: 1})

    const lowerDate = await Rate.findOne({date: {$lt: date}}, (err, item) => {
      return item;
    }).sort({date: -1})

    if (greaterDate && lowerDate) {
      const diffGreater = Math.abs(date.getTime() - greaterDate.date.getTime());
      const diffLower = Math.abs(date.getTime() - lowerDate.date.getTime());

      if (diffGreater < diffLower) {
        return greaterDate;
      } else {
        return lowerDate;
      }
    } else if (!greaterDate && !lowerDate) {
      return 'FUCK!';
    } else if (greaterDate) {
      return greaterDate;
    } else if (lowerDate) {
      return lowerDate;
    } else {
      return 'FUCK AGAIN!';
    }
  } catch (err) {
    return err;
  }
}

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

const createElement = (tag, options, text="Hello World", closingTag=true ) => {
  let tagStart = `<${tag}>`;
  let tagEnd = `</${tag}>`;
  let attrs = ''
  let result = '';
  const insertIndex = tagStart.length - 1;
  const attrArray = [" "];
  for (let [attr, val] of Object.entries(options)) {
    attr = attr.replace(/_/g, '-');
    const arr = [];
    if (val instanceof Array) {
      val.forEach((val1) => {
        let val2 = `${val1} `
        arr.push(val2);
      });
    } else {
      arr.push(val);
    }
    let rAttr = arr.join('');
    let lAttr = `${attr}="${rAttr}"`
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
}

module.exports = {
  convertRateToHomeCurrencyRate,
  findRatesByExactOrClosestDate,
  toTitleCase,
  createElement
}
