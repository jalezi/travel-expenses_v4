const moment = require('moment');

const { argv } = require('yargs')
  .command(
    ['mongoexport [options]', 'me', 'export'],
    'Export MongoDB collection from specific database',
    yargs => {
      yargs.help();
    }
  )
  .command(
    ['mongoimport [options]', 'mi', 'import'],
    'Import MongoDB collection to specific database',
    yargs => {
      yargs
        .positional('folder', {
          describe:
            'Folder where json files are located [localhost, nas, atlas]',
          type: 'string',
          default: 'localhost',
          choices: ['localhost', 'nas', 'atlas']
        })
        .help();
    }
  )
  .command(
    ['mongorestore [options]', 'mr', 'restore'],
    'Restore MongoDB database to specific datbase',
    yargs => {
      yargs
        .positional('folder', {
          describe: 'Folder where mongorestore dump files are.',
          type: 'string',
          default: `mongodump-${moment().format('YYYY-M-D')}`
        })
        .help();
    }
  )
  .options({
    dbServer: {
      description: 'Server where database is running [localhost, nas, atlas]',
      type: 'string',
      default: 'localhost',
      choices: ['localhost', 'nas', 'atlas']
    },
    logLevel: {
      description: 'Log level',
      type: 'string',
      default: 'debug',
      choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
    },
    collection: {
      description: 'Collections to use export/import',
      type: 'string',
      choices: ['currencies', 'expenses', 'rates', 'travels', 'users'],
      default: ['currencies', 'expenses', 'rates', 'travels', 'users']
    }
  })
  .array('collection')
  .demandCommand(1)
  .help()
  .group('dbServer', 'Options')
  .group('logLevel', 'Options')
  .group('collection', 'Options')
  .group('folder', 'Specific options');

exports.argv = argv;

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
