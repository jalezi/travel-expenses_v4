// test change gitflow again
const PdfPrinter = require('pdfmake');
const moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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

function toCurrencyFormat (amount) {
  const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const result = formatter.format(amount);
  return result;
}

function buildTableBody(data, columns, tableHeader, total = 0) {

    let body = [];
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
              dataRowObject.alignment = 'right';
            } else if (column === 'description') {
              dataRowObject.alignment = 'left';
            } else {
              dataRowObject.alignment = 'center';
            }
            // dataRow.push(row[column].toString());
            dataRow.push(dataRowObject);
        })

        body.push(dataRow);
    });
    const totalRowStyle = {
      alignment: 'right',
      bold: true,
      fontSize: 12
    }
    const totalRow = [{
      colSpan: 6,
      text: `TOTAL`,
      style: totalRowStyle
    }, {}, {}, {}, {}, {}, {
      text: toCurrencyFormat(total),
      style: totalRowStyle
    }];
    body.push(totalRow);

    return body;
}

function table(data, columns, tableHeader, style = {}, travelTotal = 0) {
    return {

        style: style,
        layout: 'lightHorizontalLines',
        alignment: 'center',
        table: {
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto' ],
            heights: function(row) {
              switch (row) {
                case 0:
                  return 10;
                  break;
                case data.length + 1:
                  return 5
                default:
                  return 20
              }
            },
            headerRows: 1,
            body: buildTableBody(data, columns, tableHeader, travelTotal)
        }
    };
}

function createTravelExpensesTableData (travel) {
  const expenses = travel.expenses;
  const dataObjects = [];
  expenses.forEach((expense, key, object) => {
    const newObject = {};
    newObject.date = moment(expense.date).format('l');
    newObject.type = expense.type;
    newObject.description = expense.description,
    newObject.amount = toCurrencyFormat(expense.amount);
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
  return dataObjects;
}

module.exports = (travel, user) => {

  if (!user.profile.name) {
    user.profile.name = 'Unknown';
  }

  console.log(typeof ObjectId(travel._id).getTimestamp());
  console.log(typeof ObjectId(travel._id).toString());
  console.log(typeof ObjectId(travel._id).valueOf());

  const invoiceNumber = ObjectId(travel._id).toString();
  const dateFrom = moment(travel.dateFrom).format('ddd, MMM Do YYYY');
  const dateTo = moment(travel.dateTo).format('ddd, MMM Do YYYY');

  const tableData = createTravelExpensesTableData(travel);
  const dataProperties = ['date', 'type', 'description', 'amount', 'currency', 'rate', travel.homeCurrency];
  const tableHeader = ['DATE', 'TYPE', 'DESCRIPTION', 'AMOUNT', 'CURRENCY', 'RATE', travel.homeCurrency];
  const tableStyle = {alignment: 'center', fontSize: 10, margin: [20, 0, 20, 0], width: '*'};

  const titlePdf = `${travel.description}`;
  const authorPdf = `${user.profile.name}`;
  const subjectPdf = 'Travel expenses';
  const keywordsPdf = 'travel report expense';

  const expensesTable = table(tableData, dataProperties, tableHeader, tableStyle, travel.total);
  let total = toCurrencyFormat(travel.total);
  const docDefinition = {
    // ...
    // pageSize: 'A4',
    footer: function(currentPage, pageCount, pageSize) {
      return [
        {canvas: [
          {type: 'line',	x1: 30, y1: 15,	x2: 559.28, y2: 15,	lineWidth: 1, lineCap: 'square'}
        ]},

        {text: currentPage.toString() + ' of ' + pageCount, alignment: 'center', fontSize: 10, margin: [0, 10]}

      ];
    },
    header: function(currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element
      return [
        {columns: [
          {text: 'Created with TExpApp', alignment: (currentPage % 2) ? 'left' : 'right', fontSize: 10},
          {text: moment().format('YYYY-MM-DD'), alignment: (currentPage % 2) ? 'right' : 'left', fontSize: 10}
        ]},
        {canvas: [{type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 100, fillColor: 'red'}]}
      ]
    },
    info: {
      producer: 'TExpApp',
      title: titlePdf,
      author: authorPdf,
      subject: subjectPdf,
      keywords: keywordsPdf,
  },
    content: [
      {stack: [
          {text: 'EXPENSES REPORT'}
        ],
        style: 'title'
      },
      {stack: [
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
        }}
      ]},
      {stack: [
        {text: `invoice: ${invoiceNumber}`},
        {text: travel.description, style: 'description'},
        {
          layout: 'noBorders',
          table: {
            style: 'travelDate',
            widths: ['*', 'auto'],
            body: [
              ['From:', dateFrom],
              ['To:', dateTo]
            ]

        }}
      ],
      style: 'travelInfo'
    },
      {text: `Total: ${travel.homeCurrency} ${total}`, margin: [0, 0, 0, 20], color: '#696969'},
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
      fontSize:18,
      bold: true
    },
    travelDate: {
      fontSize:12,
      bold: false
    }
  }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  const pdfDocPath = `./pdf/TReport_${user._id}_${travel._id}.pdf`;
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  return pdfDoc;
}
