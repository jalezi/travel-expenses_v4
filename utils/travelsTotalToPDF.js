// test change gitflow again
/**
 * @fileOverview Functions to create Total PDF
 *
 * @requires NPM:pdfmake
 * @requires NPM:moment
 * @requires NPM:fs
 *
 * @requires lib/constants.FONTS
 * @requires config/logger.addLogger
 */

const PdfPrinter = require('pdfmake');
const moment = require('moment');

const fs = require('fs');

const { FONTS } = require('../lib/constants');
const { toCurrencyFormat } = require('./utils');
const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const printer = new PdfPrinter(FONTS);


/**
 * Creates table body
 *
 * @param {*} data
 * @param {*} columns
 * @param {*} tableHeader
 * @param {number} [total=0]
 * @returns {Array}
 */
function buildTableBody(data, columns, tableHeader, total = 0) {
  const totalInCurrencyFormat = toCurrencyFormat(total);
  let body = [];
  if (!tableHeader) {
    tableHeader = columns;
  }

  body.push(tableHeader);

  data.forEach(row => {
    let dataRow = [];
    columns.forEach(column => {
      const dataRowObject = {};
      dataRowObject.text = row[column].toString();
      if (['amount', 'perMile', tableHeader[tableHeader.length - 1]].includes(column)) {
        dataRowObject.alignment = 'right';
      } else if (column === 'description') {
        dataRowObject.alignment = 'left';
      } else {
        dataRowObject.alignment = 'center';
      }
      dataRow.push(dataRowObject);
    });
    const invoiceNumberStyle = {
      alignment: 'left',
      bold: true,
      fontSize: 8
    };
    let idRow = [{
      colSpan: 1,
      text: 'invoice:',
      style: invoiceNumberStyle
    }, {
      colSpan: 1,
      text: row._id,
      style: invoiceNumberStyle
    }, {}, {}, {}, {}];
    body.push(idRow);
    body.push(dataRow);
  });
  const totalRowStyle = {
    alignment: 'right',
    bold: true,
    fontSize: 12
  };
  const totalRow = [{
    colSpan: 5,
    text: 'TOTAL',
    style: totalRowStyle
  }, {}, {}, {}, {}, {
    text: totalInCurrencyFormat,
    style: totalRowStyle
  }];
  body.push(totalRow);
  Logger.debug(`Build table body => ${body}`);
  return body;
}

/**
 * Creates pdf table
 *
 * @param {*} data
 * @param {*} columns
 * @param {*} tableHeader
 * @param {*} [style={}]
 * @param {number} [sum=0]
 * @returns {Object}
 */
function table(data, columns, tableHeader, style = {}, sum = 0) {
  return {
    style,
    layout: 'lightHorizontalLines',
    alignment: 'center',
    table: {
      widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],
      heights: row => {
        switch (row) {
          case 0:
            return 10;
          case data.length * 2 + 1:
            return 5;
          default:
        }
        let h = row % 2 === 0 ? 20 : 10;
        return h;
      },
      headerRows: 1,
      body: buildTableBody(data, columns, tableHeader, sum)
    }
  };
}

/**
 *
 *
 * @param {*} travels
 * @param {*} indexes
 * @returns {Object[]}
 */
function createTravelsTotalTableData(travels, indexes) {
  const dataObjects = [];
  travels.forEach((travel, key) => {
    const newObject = {};
    newObject._id = `${travel._id.toString()}-${indexes[key]}`;
    newObject.dateFrom = moment(travel.dateFrom).format('l');
    newObject.dateTo = moment(travel.dateTo).format('l');
    newObject.description = travel.description;
    newObject.currency = travel.homeCurrency;
    newObject.perMile = travel.perMileAmount;
    newObject.amount = toCurrencyFormat(travel.total);
    dataObjects.push(newObject);
  });
  return dataObjects;
}

/**
 * Return pdf TOTAL file.
 *
 * @module
 * @param {Travel[]} travels
 * @param {User} user
 * @param {*} dateRange
 * @param {(string | number)} sum
 * @param {Number[]} indexes
 * @returns {fs.createWriteStream}f
 */
module.exports = (travels, user, dateRange, sum, indexes) => {
  Logger.debug('Creating pdf Total');
  Logger.debug(`Travel indexes: ${indexes}`);
  const titlePdf = 'TOTAL';
  const authorPdf = `${user.profile.name}`;
  const subjectPdf = 'Travel expenses';
  const keywordsPdf = 'travel report expense';
  const { df } = dateRange;
  const { dt } = dateRange;
  const dateFrom = moment(df).format('ddd, MMM Do YYYY');
  const dateTo = moment(dt).format('ddd, MMM Do YYYY');
  Logger.debug(`dateFrom: ${dateFrom}, dateTo: ${dateTo}`);

  const tableData = createTravelsTotalTableData(travels, indexes);

  const dataProperties = ['dateFrom', 'dateTo', 'description', 'currency', 'perMile', 'amount'];
  let homeDistance;
  if (user.homeDistance === 'mi') {
    homeDistance = 'MILE';
  } else if (user.homeDistance === 'km') {
    homeDistance = 'KM';
  } else {
    homeDistance = 'X';
  }
  const tableHeader = ['FROM', 'TO', 'DESCRIPTION', 'CUR', `PER ${homeDistance}`, 'AMOUNT'];
  const tableStyle = { alignment: 'center', fontSize: 10, margin: [20, 0, 20, 0], width: '*' };

  const travelsTable = table(tableData, dataProperties, tableHeader, tableStyle, sum);
  sum = toCurrencyFormat(sum);

  const docDefinition = {
    // ...
    // pageSize: 'A4',
    footer: (currentPage, pageCount) => [

      {
        canvas: [
          {
            type: 'line', x1: 30, y1: 15, x2: 559.28, y2: 15, lineWidth: 1, lineCap: 'square'
          }
        ]
      },

      { text: `${currentPage.toString()} of ${pageCount}`, alignment: 'center', fontSize: 10, margin: [0, 10] }
    ],
    header: (currentPage, pageCount, pageSize) =>
      // you can apply any logic and return any valid pdfmake element
      [
        {
          columns: [
            { text: 'Created with TExpApp', alignment: (currentPage % 2) ? 'left' : 'right', fontSize: 10 },
            { text: moment().format('YYYY-MM-DD'), alignment: (currentPage % 2) ? 'right' : 'left', fontSize: 10 }
          ]
        },
        {
          canvas: [{
            type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 100, fillColor: 'red'
          }]
        }
      ],
    info: {
      producer: 'myApp',
      title: titlePdf,
      author: authorPdf,
      subject: subjectPdf,
      keywords: keywordsPdf,
    },
    content: [
      {
        stack: [
          { text: 'TOTAL REPORT' }
        ],
        style: 'title'
      },
      {
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
      },
      {
        stack: [
          { text: 'TOTAL', style: 'description' },
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
      },
      { text: `Total: ${user.homeCurrency} ${sum}`, margin: [0, 0, 0, 20], color: '#696969' },
      travelsTable
    ],
    styles: {
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
      }
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  const pdfDocPath = `./pdf/TOTAL_${user._id}_${df}_${dt}.pdf`;
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  Logger.debug('Returning pdfDoc');
  return pdfDoc;
};
