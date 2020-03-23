/* eslint-disable prefer-destructuring */
const PdfPrinter = require('pdfmake');
const moment = require('moment');
const fs = require('fs');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('travelExpensesToPDF');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\travelExpensesToPDF INITIALIZING!');

const {
  utils,
  createInfo,
  footer,
  header,
  createContent,
  styles,
  createTableObject,
  bTableBody,
  dataRowAlignment
} = require('.');

const { ObjectId, FONTS, toCurrencyFormat } = utils;
const { totalRow: tRow } = bTableBody;

const printer = new PdfPrinter(FONTS);

// Returns pdfmake table body
function buildTableBody(data, columns, tableHeader, total = 0) {
  logger.debug('buildTableBody');
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
      const cond = ['amount', 'rate', tableHeader[tableHeader.length - 1]].includes(column);
      logger.debug(cond.toString());
      dataRowObject.alignment = dataRowAlignment(cond, column);
      logger.debug(dataRowObject.alignment);
      dataRow.push(dataRowObject);
    });

    body.push(dataRow);
  });
  const totalRow = tRow({ colSpan: 6 }, 5, total);
  body.push(totalRow);
  logger.debug(`Build table body => ${body}`);
  logger.debug('buildTableBody END');
  return body;
}

// Returns pdfmake table
function table(data, columns, tableHeader, style = {}, travelTotal = 0) {
  logger.debug('table');
  const heights = row => {
    switch (row) {
      case 0:
        return 10;

      case data.length + 1:
        return 5;
      default:
        return 20;
    }
  };
  const widths = ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'];
  const body = buildTableBody(data, columns, tableHeader, travelTotal);
  const tableObject = createTableObject({
    style,
    heights,
    table: { widths, body }
  });
  logger.debug('table END');
  return tableObject;
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
      const entries = Object.entries(expense.curRate.rate);
      const entry = entries[0];
      newObject.currency = entry[0];
      newObject.rate = entry[1];
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

  const titlePdf = travel.description;
  const authorPdf = user.profile.name;
  const subjectPdf = 'Travel expenses';
  const keywordsPdf = 'travel report expense';
  const info = createInfo(titlePdf, authorPdf, subjectPdf, keywordsPdf);

  const expensesTable = table(
    tableData,
    dataProperties,
    tableHeader,
    styles.tableStyle,
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
