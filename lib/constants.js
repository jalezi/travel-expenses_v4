/**
 * Font object
 * @memberof module:lib/constants
 * @alias font
 * @typedef {object} font
 * @property {string} normal      Normal font
 * @property {string} bold        Bold font
 * @property {string} italics     Italics font
 * @property {string} bolditalics Bold and italics font
 */

/**
 * Expense header constant
 * @private
 * @type {string[]}
 */
const IMPORT_TRAVEL_HEADER = [
  'dateFrom',
  'dateTo',
  'description',
  'homeCurrency',
  'perMileAmount',
  'total'
];

/**
 * Expense headest constant
 * @private
 * @type {string[]}
 */
const IMPORT_EXPENSE_HEADER = [
  'type',
  'description',
  'date',
  'amount',
  'currency',
  'rate',
  'amountConverted',
  'unit',
  'travelName',
  'base'
];

/**
 * Helvetica font
 * @private
 * @type {font}
 */
const Helvetica = {
  normal: 'Helvetica',
  bold: 'Helvetica-Bold',
  italics: 'Helvetica-Oblique',
  bolditalics: 'Helvetica-BoldOblique'
};

/**
 * Roboto font
 * @private
 * @type {font}
 */
const Roboto = {
  normal: 'Helvetica',
  bold: 'Helvetica-Bold',
  italics: 'Helvetica-Oblique',
  bolditalics: 'Helvetica-BoldOblique'
};

/**
 * Fonts
 * @private
 * @type {Object.<font>}
 * @property {font} Helvetica
 * @property {font} Roboto
 */
const FONTS = {
  Helvetica,
  Roboto
};

/**
 * Http requests
 * @private
 * @type {string[]}
 */
const HTTP = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE'
];

const OS_COMMANDS = {
  windows: {
    delete: {
      directory: {
        withContent: 'rmdir /Q /S'
      }
    }
  },
  linux: {
    delete: {
      directory: {
        withContent: 'rm -rf'
      }
    }
  },
}


/**
 * Some constants
 * @module lib/constants
 * @author Jaka Daneu
 *
 */

/**
 * Constants freezed object
 * @type {object}
 * @property {number} MILES_TO_KILOMETERS     Miles to kilometers conversion
 * @property {number} KILOMETERS_TO_MILES     Kilometers to miles conversion
 * @property {string[]} IMPORT_TRAVEL_HEADER  Mandatory header line in CSV file for TRAVELS import
 * @property {string[]} IMPORT_EXPENSE_HEADER Mandatory header line in CSV file for EXPENSES import
 * @property {Object.<font>} FONTS                   Different fonts
 * @property {string[]} HTTP                  Possible HTTP requests
 *
 */
module.exports = Object.freeze({
  MILES_TO_KILOMETERS: 1.609344,
  KILOMETERS_TO_MILES: 0.621371,
  IMPORT_TRAVEL_HEADER,
  IMPORT_EXPENSE_HEADER,
  FONTS,
  HTTP,
  OS_COMMANDS
});
