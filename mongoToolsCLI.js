const { argv } = require('./utils/dbBackup/getYargs');

const {
  getExeAndBackupDirPath,
  setCMD,
  execFunc,
  loopCollections
} = require('./utils/dbBackup/dbBackupUtils');

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

const { backupDirPath, exeFilePath } = getExeAndBackupDirPath();

mainLogger.debug(exeFilePath, { label: 'exeFilePath' });
mainLogger.debug(backupDirPath, { label: 'backupDirPath' });

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

const cmdOptions = [
  'host',
  'readPreference',
  'port',
  'ssl',
  'username',
  'password',
  'authenticationDatabase',
  'db'
];
const mongoRestore = (command = exeFilePath, folder = argv.folder) => {
  const label = 'mongoRestore';
  logger.debug('mongoRestore START', { label });
  let cmd = `${command} `;
  cmd = setCMD(cmd, cmdOptions, undefined, folder, undefined, true);
  logger.debug(cmd, { label });
  execFunc(cmd);

  logger.debug('mongoRestore END', { label });
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
  default:
    mainLogger.warn(argv._[0], { label: 'Wrong 1st argument' });
    process.exit(9);
}
