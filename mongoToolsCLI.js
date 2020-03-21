const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const appRoot = require('app-root-path');

const env = dotenv.config({ path: appRoot.resolve('.env') });
dotenvExpand(env);
if (env.error) {
  throw env.error;
}

const { argv } = require('./utils/dbBackup/getYargs');
const { setCMD } = require('./utils/dbBackup/utils');
const {
  getExeAndBackupDirPath,
  execFunc,
  loopCollections
} = require('./utils/dbBackup/dbBackupUtils');
const { CMD_OPTIONS } = require('./lib/constants');

const LoggerClass = require('./config/LoggerClass');

const Logger = new LoggerClass('mongoCLT');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\mongoCLT INITIALIZING!');

mainLogger.silly(JSON.stringify(argv), { label: 'yargs.argv' });
if (argv._.length === 0) {
  mainLogger.error('Not valid command!');
  process.exit(9);
}
mainLogger.debug(argv._[0], { label: 'argv._[0]' });

const { exeFilePath } = getExeAndBackupDirPath();

mainLogger.debug(exeFilePath, { label: 'exeFilePath' });

const mongoExport = (
  command = exeFilePath,
  folder = argv.dbServer,
  collection = argv.collection
) => {
  const label = 'mongoExport';
  logger.debug('mongoExport Starts', { label });
  loopCollections(command, collection, folder);
  logger.debug('mongoExport END', { label });
};

const mongoImport = (
  command = exeFilePath,
  folder = argv.folder,
  collection = argv.collection
) => {
  const label = 'mongoImport';
  logger.debug('mongoImport START', { label });
  loopCollections(command, collection, folder, 'merge');
  logger.debug('mongoImport END', { label });
};

const mongoRestore = (command = exeFilePath, folder = argv.folder) => {
  const label = 'mongoRestore';
  logger.debug('mongoRestore START', { label });
  let cmd = `${command} `;
  cmd = setCMD(cmd, CMD_OPTIONS, undefined, folder, undefined, true);
  logger.debug(cmd, { label });
  execFunc(cmd);

  logger.debug('mongoRestore END', { label });
};

const mongoDump = (command = exeFilePath, folder = argv.folder) => {
  const label = 'mongoDump';
  logger.debug('mongoDump START', { label });
  let cmd = `${command} `;
  cmd = setCMD(cmd, CMD_OPTIONS, undefined, folder, 'out', true);
  logger.debug(cmd, { label });
  execFunc(cmd);

  logger.debug('mongoDump END', { label });
};

// Run specific command
switch (argv._[0]) {
  case 'mongoexport':
  case 'me':
  case 'export':
    mainLogger.info('MONGOEXPORT');
    mongoExport();
    break;
  case 'mongoimport':
  case 'mi':
  case 'import':
    mainLogger.info('MONGOIMPORT');
    mongoImport();
    break;
  case 'mongorestore':
  case 'mr':
  case 'restore':
    mainLogger.info('MONGORESTORE');
    mongoRestore();
    break;
  case 'mongodump':
  case 'md':
  case 'dump':
    mainLogger.info('MONGODUMP');
    mongoDump();
    break;
  default:
    mainLogger.warn(argv._[0], { label: 'Wrong 1st argument' });
    process.exit(9);
}
