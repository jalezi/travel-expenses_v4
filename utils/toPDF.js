const PdfPrinter = require('pdfmake');
const moment = require('moment');

const fs = require('fs');

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

function buildTableBody(data, columns, tableHeader, total = 0) {

    var body = [];
    if (!tableHeader) {
      tableHeader = columns;
    }

    body.push(tableHeader);

    data.forEach(function(row) {
        var dataRow = [];

        columns.forEach(function(column) {
            const dataRowObject = {};
            dataRowObject.text = row[column].toString();
            if (['amount', 'rate', tableHeader[tableHeader.length - 1]].includes(column)) {
              console.log(column, 'right');
              dataRowObject.alignment = 'right';
            } else if (column === 'description') {
              console.log(column, 'left');
              dataRowObject.alignment = 'left';
            } else {
              console.log(column, 'center');
              dataRowObject.alignment = 'center';
            }
            // dataRow.push(row[column].toString());
            dataRow.push(dataRowObject);
        })

        body.push(dataRow);
    });
    console.log('buildTableBody', Number(total));
    const totalRow = [{
      colSpan: 7,
      text: `TOTAL: ${total.toString()}`,
      style: {
        alignment: 'right',
        bold: true,
        fontSize: 12
      }
    }]
    body.push(totalRow);
    
    return body;
}

function table(data, columns, tableHeader, style = {}, travelTotal = 0) {
  console.log('table', Number(travelTotal));
    return {
        widths: ['*', '*', 'auto', 'auto', '*', '*', 'auto' ],
        style: style,
        layout: 'lightHorizontalLines',
        table: {
            headerRows: 1,
            body: buildTableBody(data, columns, tableHeader, travelTotal)
        }
    };
}

function createTableData (travel) {
  const expenses = travel.expenses;
  const dataObjects = [];
  expenses.forEach((expense, key, object) => {
    const newObject = {};
    newObject.date = moment(expense.date).format('l');
    newObject.type = expense.type;
    newObject.description = expense.description,
    newObject.amount = expense.amount;
    if (expense.type != 'Mileage') {
      newObject.currency = Object.keys(expense.curRate.rate)[0];
      newObject.rate = Object.values(expense.curRate.rate)[0];
    } else {
      newObject.currency = expense.unit;
      newObject.rate = travel.perMileAmount;
    }
    newObject[travel.homeCurrency] = expense.amountConverted;
    dataObjects.push(newObject);
  });
  return dataObjects
}

module.exports = (travel, user) => {
  const dateFrom = moment(travel.dateFrom).format('ddd, MMM Do YYYY');
  const dateTo = moment(travel.dateTo).format('ddd, MMM Do YYYY');
  const tableData = createTableData(travel);
  const dataProperties = ['date', 'type', 'description', 'amount', 'currency', 'rate', travel.homeCurrency];
  const tableHeader = ['DATE', 'TYPE', 'DESCRIPTION', 'AMOUNT', 'CURRENCY', 'RATE', travel.homeCurrency];
  const tableStyle = {alignment: 'center', fontSize: 10};
  // const tableData = [{ name: 'Bartek', age: 34 },
  //   { name: 'John', age: 27 },
  //   { name: 'Elizabeth', age: 30 }];
  // const tableHeader = ['name', 'age'];
  const docDefinition = {
    // ...
    footer: function(currentPage, pageCount) {
      return currentPage.toString() + ' of ' + pageCount;
    },
    header: function(currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element

      return [
        {text: user.profile.name, alignment: (currentPage % 2) ? 'left' : 'right'},
        {canvas: [{type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40}]}
      ]
    },
    content: [
      {text: 'TRAVEL REPORT', style: 'title'},
      {text: travel.description, style: 'description'},
      {text: `From: ${dateFrom}`, style: 'travelDate'},
      {text: `To: ${dateTo}`, style: 'travelDate'},
      table(tableData, dataProperties, tableHeader, tableStyle, travel.total),
      // {text: `TOTAL: ${travel.total}`, style: 'total'}
    ],
    styles: {
    title: {
      fontSize: 18,
      bold: true
    },
    description: {
      fontSize:22,
      bold: true
    },
    travelDate: {
      fontSize:14,
      bold: true
    }
  }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('document.pdf'));
  pdfDoc.end();
  return pdfDoc;
}
