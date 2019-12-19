/* eslint-disable prefer-destructuring */
// test change gitflow again

const PdfPrinter = require('pdfmake');
const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('travelExpensesToPDF');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\travelExpensesToPDF INITIALIZING!');

const { ObjectId } = mongoose.Types;

const { FONTS } = require('../../lib/constants');
const { toCurrencyFormat } = require('../utils');

const {
  createInfo, footer, header, createContent, styles
} = require('./');

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
      if (
        ['amount', 'rate', tableHeader[tableHeader.length - 1]].includes(column)
      ) {
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
  const totalRow = [
    {
      colSpan: 6,
      text: 'TOTAL',
      style: totalRowStyle
    },
    {},
    {},
    {},
    {},
    {},
    {
      text: toCurrencyFormat(total),
      style: totalRowStyle
    }
  ];
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
function createTravelExpensesTableData(travel) {
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
  const dateRange = {
    dateFrom,
    dateTo
  };

  const tableData = createTravelExpensesTableData(travel);
  const dataProperties = [
    'date',
    'type',
    'description',
    'amount',
    'currency',
    'rate',
    travel.homeCurrency
  ];
  const tableHeader = [
    'DATE',
    'TYPE',
    'DESCRIPTION',
    'AMOUNT',
    'CURRENCY',
    'RATE',
    travel.homeCurrency
  ];
  const tableStyle = {
    alignment: 'center',
    fontSize: 10,
    margin: [20, 0, 20, 0],
    width: '*'
  };

  const titlePdf = travel.description;
  const authorPdf = user.profile.name;
  const subjectPdf = 'Travel expenses';
  const keywordsPdf = 'travel report expense';
  const info = createInfo(titlePdf, authorPdf, subjectPdf, keywordsPdf);

  const expensesTable = table(
    tableData,
    dataProperties,
    tableHeader,
    tableStyle,
    travel.total
  );

  let total = toCurrencyFormat(travel.total);
  const information = {};
  information.title = 'EXPENSES REPORT';
  information.invoice = invoiceNumber;
  information.description = travel.description;
  information.user = user;
  information.dateRange = dateRange;
  information.sum = total;
  information.currency = user.homeCurrency;
  information.table = expensesTable;
  const content = createContent(information);
  const docDefinition = {
    // ...
    // pageSize: 'A4',
    footer,
    header,
    info,
    content,
    styles
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  const pdfDocPath = `./pdf/TReport_${user._id}_${travel._id}-${idx}.pdf`;
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  logger.debug('Returning pdfDoc');
  return pdfDoc;
};
