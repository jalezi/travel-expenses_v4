// test change gitflow again
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
        let dataRow = [];
        // console.log(row);
        columns.forEach(function(column) {
          // console.log(column);
            const dataRowObject = {};
            dataRowObject.text = row[column].toString();
            if (['amount', 'perMile', tableHeader[tableHeader.length - 1]].includes(column)) {
              // console.log(column, 'right');
              dataRowObject.alignment = 'right';
            } else if (column === 'description') {
              // console.log(column, 'left');
              dataRowObject.alignment = 'left';
            } else {
              // console.log(column, 'center');
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
      colSpan: 5,
      text: `TOTAL`,
      style: totalRowStyle
    }, {}, {}, {}, {}, {
      text: total.toString(),
      style: totalRowStyle
    }];
    body.push(totalRow);

    return body;
}

function table(data, columns, tableHeader, style = {}, sum = 0) {

    return {

        style: style,
        layout: 'lightHorizontalLines',
        alignment: 'center',
        table: {
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
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
            body: buildTableBody(data, columns, tableHeader, sum)
        }
    };
}

function createTravelsTotalTableData(travels) {
  const dataObjects = [];

  travels.forEach((travel, key, object) => {
    const newObject = {};
    newObject.dateFrom = moment(travel.dateFrom).format('l');
    newObject.dateTo = moment(travel.dateTo).format('l');
    newObject.description = travel.description;
    newObject.currency = travel.homeCurrency;
    newObject.perMile = travel.perMileAmount;
    newObject.amount = travel.total;
    dataObjects.push(newObject);
  });
  return dataObjects;
}

module.exports = (travels, user, dateRange, sum) => {

  const titlePdf = `TOTAL`;
  const authorPdf = `${user.profile.name}`;
  const subjectPdf = 'Travel expenses';
  const keywordsPdf = 'travel report expense';
  const df = dateRange.df;
  const dt = dateRange.dt;
  const dateFrom = moment(df).format('ddd, MMM Do YYYY');
  const dateTo = moment(dt).format('ddd, MMM Do YYYY');

  const tableData = createTravelsTotalTableData(travels);

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
  const tableStyle = {alignment: 'center', fontSize: 10, margin: [20, 0, 20, 0], width: '*'};

  const travelsTable = table(tableData, dataProperties, tableHeader, tableStyle, sum);
  console.log(travelsTable.table);

  const docDefinition = {
    // ...
    // pageSize: 'A4',
    footer: function(currentPage, pageCount, pageSize) {
      return [
,
        {canvas: [
          {type: 'line',	x1: 30, y1: 0,	x2: 559.28, y2: 0,	lineWidth: 1, lineCap: 'square'}
        ]},

        {text: currentPage.toString() + ' of ' + pageCount, alignment: 'center', fontSize: 10, margin: [0, 10]},
        {canvas: [{type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 100, fillColor: 'red'}]}
      ];
    },
    header: function(currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element
      return [
        {columns: [
          {text: 'Created with AppName', alignment: (currentPage % 2) ? 'left' : 'right', fontSize: 10},
          {text: moment().format('YYYY-MM-DD'), alignment: (currentPage % 2) ? 'right' : 'left', fontSize: 10}
        ]},
        {canvas: [{type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 100, fillColor: 'red'}]}
      ]
    },
    info: {
      producer: 'myApp',
      title: titlePdf,
      author: authorPdf,
      subject: subjectPdf,
      keywords: keywordsPdf,
  },
    content: [
      {stack: [
          {text: 'TOTAL REPORT'}
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
              ['Team:', 'SAN ANTONIO SPURS'],
              ['Name:', user.profile.name],
              ['Position:', 'Whatever']
            ]
        }}
      ]},
      {stack: [
        {text: 'TOTAL', style: 'description'},
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
    {text: `Total expenses: ${user.homeCurrency} ${sum}`, margin: [0, 0, 0, 20], color: '#696969'},
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
  console.log(docDefinition);
  console.log();
  const pdfDocPath = `./pdf/TOTAL_${user._id}.pdf`;
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  return pdfDoc;
}
