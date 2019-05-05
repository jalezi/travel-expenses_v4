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

module.exports = (travels, user, dateRange, sum) => {

  const titlePdf = `TOTAL`;
  const authorPdf = `${user.profile.name}`;
  const subjectPdf = 'Travel expenses';
  const keywordsPdf = 'travel report expense';
  const df = dateRange.df;
  const dt = dateRange.dt;

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
          {text: 'TOTAL REPORT'},
          {text: 'From: ' + df},
          {text: 'To: ' + dt},
          {text: 'Total: ' + sum}
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
      ]}
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
  // console.log(docDefinition);
  // console.log();
  const pdfDocPath = `./pdf/TOTAL_${user._id}.pdf`;
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  return pdfDoc;
}
