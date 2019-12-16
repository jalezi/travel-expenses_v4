/* eslint-disable prefer-destructuring */
// test change gitflow again

const PdfPrinter = require('pdfmake');
const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs');

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('travelExpensesToPDF');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\travelExpensesToPDF INITIALIZING!');

const { ObjectId } = mongoose.Types;

const { FONTS } = require('../lib/constants');
const { toCurrencyFormat } = require('./utils');

const printer = new PdfPrinter(FONTS);


// Returns pdfmake table body
function buildTableBody(data, columns, tableHeader, total = 0) {
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
      if (['amount', 'rate', tableHeader[tableHeader.length - 1]].includes(column)) {
        dataRowObject.alignment = 'right';
      } else if (column === 'description') {
        dataRowObject.alignment = 'left';
      } else {
        dataRowObject.alignment = 'center';
      }
      // dataRow.push(row[column].toString());
      dataRow.push(dataRowObject);
    });

    body.push(dataRow);
  });
  const totalRowStyle = {
    alignment: 'right',
    bold: true,
    fontSize: 12
  };
  const totalRow = [{
    colSpan: 6,
    text: 'TOTAL',
    style: totalRowStyle
  }, {}, {}, {}, {}, {}, {
    text: toCurrencyFormat(total),
    style: totalRowStyle
  }];
  body.push(totalRow);
  logger.debug(`Build table body => ${body}`);
  return body;
}

// Returns pdfmake table
function table(data, columns, tableHeader, style = {}, travelTotal = 0) {
  return {

    style,
    layout: 'lightHorizontalLines',
    alignment: 'center',
    table: {
      widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
      heights(row) {
        switch (row) {
          case 0:
            return 10;

          case data.length + 1:
            return 5;
          default:
            return 20;
        }
      },
      headerRows: 1,
      body: buildTableBody(data, columns, tableHeader, travelTotal)
    }
  };
}

// Returns data for table data
function createTravelExpensesTableData (travel) {
  const { expenses } = travel;
  const dataObjects = [];
  expenses.forEach(expense => {
    const newObject = {};
    newObject.date = moment(expense.date).format('l');
    newObject.type = expense.type;
    newObject.description = expense.description;
    newObject.amount = toCurrencyFormat(expense.amount);
    if (expense.type !== 'Mileage') {
      newObject.currency = Object.keys(expense.curRate.rate)[0];
      newObject.rate = Object.values(expense.curRate.rate)[0];
    } else {
      newObject.currency = expense.unit;
      newObject.rate = travel.perMileAmount;
    }
    newObject[travel.homeCurrency] = toCurrencyFormat(expense.amountConverted);
    dataObjects.push(newObject);
  });
  return dataObjects;
}

// Returns travel pdfmake stream
module.exports = (travel, user, idx) => {
  logger.debug('Creating pdf Travel');
  if (!user.profile.name) {
    user.profile.name = 'Unknown';
  }

  const invoiceNumber = `${ObjectId(travel._id).toString()}-${idx}`;
  const dateFrom = moment(travel.dateFrom).format('ddd, MMM Do YYYY');
  const dateTo = moment(travel.dateTo).format('ddd, MMM Do YYYY');

  const tableData = createTravelExpensesTableData(travel);
  const dataProperties = ['date', 'type', 'description', 'amount', 'currency', 'rate', travel.homeCurrency];
  const tableHeader = ['DATE', 'TYPE', 'DESCRIPTION', 'AMOUNT', 'CURRENCY', 'RATE', travel.homeCurrency];
  const tableStyle = { alignment: 'center', fontSize: 10, margin: [20, 0, 20, 0], width: '*' };

  const titlePdf = `${travel.description}`;
  const authorPdf = `${user.profile.name}`;
  const subjectPdf = 'Travel expenses';
  const keywordsPdf = 'travel report expense';

  const expensesTable = table(tableData, dataProperties, tableHeader, tableStyle, travel.total);
  let total = toCurrencyFormat(travel.total);
  const docDefinition = {
    // ...
    // pageSize: 'A4',
    footer(currentPage, pageCount) {
      return [
        {
          canvas: [
            {
              type: 'line', x1: 30, y1: 15, x2: 559.28, y2: 15, lineWidth: 1, lineCap: 'square'
            }
          ]
        },

        { text: `${currentPage.toString()} of ${pageCount}`, alignment: 'center', fontSize: 10, margin: [0, 10] }

      ];
    },
    header(currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element
      return [
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
      ];
    },
    info: {
      producer: 'TExpApp',
      title: titlePdf,
      author: authorPdf,
      subject: subjectPdf,
      keywords: keywordsPdf,
    },
    content: [
      {
        stack: [
          { text: 'EXPENSES REPORT' }
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
          { text: `invoice: ${invoiceNumber}` },
          { text: travel.description, style: 'description' },
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
      { text: `Total: ${travel.homeCurrency} ${total}`, margin: [0, 0, 0, 20], color: '#696969' },
      expensesTable
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

  const pdfDocPath = `./pdf/TReport_${user._id}_${travel._id}-${idx}.pdf`;
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  logger.debug('Returning pdfDoc');
  return pdfDoc;
};
