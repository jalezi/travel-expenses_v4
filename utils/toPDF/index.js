const moment = require('moment');
const mongoose = require('mongoose');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('toPDF');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\toPDF INITIALIZING!');

const { ObjectId } = mongoose.Types;
const { FONTS } = require('../../lib/constants');
const { toCurrencyFormat } = require('../utils');

const utils = { ObjectId, FONTS, toCurrencyFormat };

exports.utils = utils;

exports.createInfo = (title, author, subject, keywords) => {
  logger.debug('createInfo');
  const info = {
    producer: 'TravelExpensesApp',
    title,
    author,
    subject,
    keywords
  };
  logger.debug('createInfo END');
  return info;
};

exports.footer = (currentPage, pageCount) => {
  logger.debug('footer');
  const canvas = [
    {
      type: 'line',
      x1: 30,
      y1: 15,
      x2: 559.28,
      y2: 15,
      lineWidth: 1,
      lineCap: 'square'
    }
  ];
  const text = `${currentPage.toString()} of ${pageCount}`;
  const textCongig = { alignment: 'center', fontSize: 10, margin: [0, 10] };
  logger.debug('footer END');
  return [{ canvas }, { text, ...textCongig }];
};

exports.header = (currentPage, pageCount, pageSize) => {
  logger.debug('header');
  const fontSize = 10;
  const cText1 = 'Created with TExpApp';
  const cText1Config = {
    alignment: currentPage % 2 ? 'left' : 'right',
    fontSize
  };
  const column1 = { text: cText1, ...cText1Config };
  const cText2 = moment().format('YYYY-MM-DD');
  const cText2Config = {
    alignment: currentPage % 2 ? 'right' : 'left',
    fontSize
  };
  const column2 = { text: cText2, ...cText2Config };
  const columns = [{ ...column1 }, { ...column2 }];
  const canvas = [
    {
      type: 'rect',
      x: 170,
      y: 32,
      w: pageSize.width - 170,
      h: 100,
      fillColor: 'red'
    }
  ];
  logger.debug('header END');
  return [{ columns }, { canvas }];
};

const titleStack = titleText => {
  logger.debug('titleStack');
  const stack = {
    stack: [{ text: titleText }],
    style: 'title'
  };
  logger.debug('titleStack END');
  return stack;
};

const personInfoStack = user => {
  logger.debug('personInfoStack');
  const stack = {
    stack: [
      {
        style: 'personInfo',
        layout: 'noBorders',
        table: {
          style: 'personInfo',
          widths: ['auto', 'auto'],
          body: [
            ['Team:', user.team],
            ['Name:', user.fullName()],
            ['Position:', user.jobPosition]
          ]
        }
      }
    ]
  };

  logger.debug('personInfoStack END');
  return stack;
};

const travelInfoStack = info => {
  logger.debug('travelInfoStack');
  const { df, dt } = info.dateRange;
  const dateFrom = moment(df).format('ddd, MMM Do YYYY');
  const dateTo = moment(dt).format('ddd, MMM Do YYYY');
  const stack = {
    stack: [
      { text: info.description, style: 'description' },
      {
        layout: 'noBorders',
        table: {
          style: 'travelDate',
          widths: ['*', 'auto'],
          body: [
            ['From:', dateFrom],
            ['To:', dateTo]
          ]
        }
      }
    ],
    style: 'travelInfo'
  };

  if (info.invoice) {
    const invoice = { text: `invoice: ${info.invoice}` };
    stack.stack.unshift(invoice);
  }

  logger.debug('travelInfoStack END');
  return stack;
};

const totalStack = info => {
  logger.debug('totalStack');
  const stack = {
    text: `Total: ${info.currency} ${info.sum}`,
    margin: [0, 0, 0, 20],
    color: '#696969'
  };
  logger.debug('totalStack END');
  return stack;
};

const contentStacks = info => {
  logger.debug('contentStack');
  const { title, user, ...rest } = info;
  const stack1 = titleStack(title);
  const stack2 = personInfoStack(user);
  const stack3 = travelInfoStack(rest);
  const stack4 = totalStack(rest);

  const stack = [stack1, stack2, stack3, stack4];
  logger.debug('contentStack END');
  return stack;
};

exports.createContent = info => {
  logger.debug('createContent');
  const { table, ...rest } = info;
  const stacks = contentStacks(rest);
  const content = [...stacks, table];
  logger.debug('createContent END');
  return content;
};

exports.createTableObject = ({ ...args }) => {
  logger.debug('createTableObject');
  let basicObject = {};
  basicObject.layout = 'lightHorizontalLines';
  basicObject.alignment = 'center';
  basicObject.table = {};
  basicObject.table.headerRows = 1;

  const tableObject = { ...basicObject, ...args };
  logger.debug('createTableObject END');
  return tableObject;
};

const totalRowStyle = {
  alignment: 'right',
  bold: true,
  fontSize: 12
};

exports.styles = {
  tableStyle: {
    alignment: 'center',
    fontSize: 10,
    margin: [20, 0, 20, 0],
    width: '*'
  },
  title: {
    fontSize: 14,
    bold: true,
    margin: [0, 20, 0, 10]
  },
  personInfo: {
    fontSize: 12,
    margin: [0, 0, 0, 30],
    alignment: 'left',
    color: '#696969'
  },
  travelInfo: {
    margin: [0, 20, 0, 30],
    alignment: 'right'
  },
  description: {
    fontSize: 18,
    bold: true
  },
  travelDate: {
    fontSize: 12,
    bold: false
  },
  totalRowStyle,
  invoiceNumberStyle: {
    alignment: 'left',
    bold: true,
    fontSize: 8
  }
};

const totalRow = (object = { colSpan: 1 }, n = 1, total = 0) => {
  const first = {
    text: 'TOTAL',
    style: totalRowStyle
  };
  const firstObject = { ...first, ...object };
  const tRow = [firstObject];
  for (let index = 1; index <= n; index++) {
    tRow.push({});
  }
  const last = {
    text: toCurrencyFormat(total),
    style: totalRowStyle
  };
  tRow.push(last);

  return tRow;
};

exports.bTableBody = { totalRow };

exports.dataRowAlignment = (condition, column) => {
  if (condition) {
    return 'right';
  }
  if (column === 'description') {
    return 'left';
  }
  return 'center';
};
