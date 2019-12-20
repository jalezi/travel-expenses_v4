const PdfPrinter = require('pdfmake');
const moment = require('moment');
const fs = require('fs');
const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('travelsTotalToPDF');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\travelsTotalToPDF INITIALIZING!');

const { FONTS } = require('../../lib/constants');
const { toCurrencyFormat } = require('../utils');
const {
  createInfo, footer, header, createContent, styles, createTableObject
} = require('./');

const printer = new PdfPrinter(FONTS);


// Returns pdfmake table body
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
    let idRow = [{
      colSpan: 1,
      text: 'invoice:',
      style: styles.invoiceNumberStyle
    }, {
      colSpan: 1,
      text: row._id,
      style: styles.invoiceNumberStyle
    }, {}, {}, {}, {}];
    body.push(idRow);
    body.push(dataRow);
  });
  const totalRow = [{
    colSpan: 5,
    text: 'TOTAL',
    style: styles.totalRowStyle
  }, {}, {}, {}, {}, {
    text: totalInCurrencyFormat,
    style: styles.totalRowStyle
  }];
  body.push(totalRow);
  logger.debug(`Build table body => ${body}`);
  return body;
}


// Returns pdfmake table
function table(data, columns, tableHeader, style = {}, sum = 0) {
  logger.debug('table');
  const widths = ['auto', 'auto', 'auto', 'auto', '*', 'auto'];
  const heights = row => {
    switch (row) {
      case 0:
        return 10;
      case data.length * 2 + 1:
        return 5;
      default:
    }
    let h = row % 2 === 0 ? 20 : 10;
    return h;
  };
  const body = buildTableBody(data, columns, tableHeader, sum);
  const tableObject = createTableObject({ style, heights, table: { widths, body } });
  logger.debug('table END');
  return tableObject;
}

// Retruns data for total table
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

// Returns TOTAL pdfmake stream
module.exports = (travels, user, dateRange, sum, indexes) => {
  logger.debug('Creating pdf Total');
  logger.debug(`Travel indexes: ${indexes}`);

  const { df, dt } = dateRange;
  const dateFrom = moment(df).format('ddd, MMM Do YYYY');
  const dateTo = moment(dt).format('ddd, MMM Do YYYY');
  logger.debug(`dateFrom: ${dateFrom}, dateTo: ${dateTo}`);

  const tableData = createTravelsTotalTableData(travels, indexes);

  const dataProperties = ['dateFrom', 'dateTo', 'description', 'currency', 'perMile', 'amount'];
  let homeDistance = (user.homeDistance === 'mi') ? 'MILE' : 'KM';

  const subjectPdf = `Total sum of expenses from ${dateFrom} to ${dateTo}`;
  const info = createInfo('Travels total', user.profile.name, subjectPdf, 'total report travel expense ');

  const tableHeader = ['FROM', 'TO', 'DESCRIPTION', 'CUR', `PER ${homeDistance}`, 'AMOUNT'];
  const tableStyle = { alignment: 'center', fontSize: 10, margin: [20, 0, 20, 0], width: '*' };
  const travelsTable = table(tableData, dataProperties, tableHeader, tableStyle, sum);

  sum = toCurrencyFormat(sum);
  const information = {};
  information.title = 'TRAVELS TOTAL';
  information.description = 'TOTAL';
  information.user = user;
  information.dateRange = dateRange;
  information.sum = sum;
  information.currency = user.homeCurrency;
  information.table = travelsTable;
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

  const pdfDocPath = `./pdf/TOTAL_${user._id}_${df}_${dt}.pdf`;
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  logger.debug('Returning pdfDoc');
  return pdfDoc;
};
