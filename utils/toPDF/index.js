const moment = require('moment');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('toPDF');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\toPDF INITIALIZING!');

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
  const canvas = [{
    type: 'line', x1: 30, y1: 15, x2: 559.28, y2: 15, lineWidth: 1, lineCap: 'square'
  }];
  const text = `${currentPage.toString()} of ${pageCount}`;
  const textCongig = { alignment: 'center', fontSize: 10, margin: [0, 10] };
  logger.debug('footer END');
  return [
    { canvas },
    { text, ...textCongig }
  ];
};


exports.header = (currentPage, pageCount, pageSize) => {
  logger.debug('header');
  const fontSize = 10;
  const cText1 = 'Created with TExpApp';
  const cText1Config = { alignment: (currentPage % 2) ? 'left' : 'right', fontSize };
  const column1 = { text: cText1, ...cText1Config };
  const cText2 = moment().format('YYYY-MM-DD');
  const cText2Config = { alignment: (currentPage % 2) ? 'right' : 'left', fontSize };
  const column2 = { text: cText2, ...cText2Config };
  const columns = [{ ...column1 }, { ...column2 }];
  const canvas = [{
    type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 100, fillColor: 'red'
  }];
  logger.debug('header END');
  return [{ columns }, { canvas }];
};

const titleStack = titleText => {
  logger.debug('titleStack');
  const stack = {
    stack: [
      { text: titleText }
    ],
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
  const stack = { text: `Total: ${info.currency} ${info.sum}`, margin: [0, 0, 0, 20], color: '#696969' };
  logger.debug('totalStack END');
  return stack;
};


const contentStacks = info => {
  logger.debug('contentStack');
  const {
    title, user, ...rest
  } = info;
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

exports.styles = {
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
  totalRowStyle: {
    alignment: 'right',
    bold: true,
    fontSize: 12
  },
  invoiceNumberStyle: {
    alignment: 'left',
    bold: true,
    fontSize: 8
  }
};
