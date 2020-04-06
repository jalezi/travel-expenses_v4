const path = require('path');
const appRoot = require('app-root-path');

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

// Running platform
const RUNNING_PLATFORM = process.platform;

// CMD for different OS
const OS_COMMANDS = {
  win32: {
    mongoexport: '"C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongoexport.exe"',
    mongoimport: '"C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongoimport.exe"',
    mongorestore: '"C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongorestore.exe"',
    mongodump: '"C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongodump.exe"',
    delete: {
      cmd: 'rmdir',
      options: '/Q /S',
    }
  },
  linux: {
    delete: {
      cmd: 'rm',
      options: '-rf',
    }
  },
};

// Database collections
const COLLECTIONS = ['currencies', 'expenses', 'rates', 'travels', 'users'];

const MONGODB_EXPORT_IMPORT_TOOLS = {
  noVar: ['ssl'],
  all: ['username', 'password', 'host', 'port', 'ssl', 'authenticationDatabase'],
  binary: {
    mongodump: ['db', 'out'],
    mongorestore: []
  },
  data: {
    mongoexport: ['collection', 'db', 'out'],
    mongoimport: ['collection', 'db', 'file']
  }
};

// Concatenate root directory path with our backup folder.
const BCK_PARENT_DIR_PATH = appRoot.resolve('dbBackup');
const BCK_BIN_DIR_PATH = path.join(BCK_PARENT_DIR_PATH, 'database-backup');
const BCK_DATA_DIR_PATH = path.join(BCK_PARENT_DIR_PATH, 'JSON');

// Database backup paths
const BCK_PATHS = {
  BCK_PARENT_DIR_PATH,
  BCK_BIN_DIR_PATH,
  BCK_DATA_DIR_PATH
};

// Scheduled job backup options
const DB_BCK_OPTIONS = {
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 7,
  autoBackupPath: BCK_BIN_DIR_PATH
};

// TODO add file and out?
// CMD options for binary and ata MongoDB export/import tools
const CMD_OPTIONS = [
  'host',
  'readPreference',
  'port',
  'ssl',
  'username',
  'password',
  'authenticationDatabase',
  'db'
];


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
  RUNNING_PLATFORM,
  OS_COMMANDS,
  COLLECTIONS,
  MONGODB_EXPORT_IMPORT_TOOLS,
  BCK_PATHS,
  DB_BCK_OPTIONS,
  CMD_OPTIONS
});
