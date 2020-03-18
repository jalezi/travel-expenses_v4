const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { exec } = require('child_process');
const appRoot = require('app-root-path');
const path = require('path');
const moment = require('moment');
const { argv } = require('yargs')
  .command(['mongoexport [options]', 'me', 'export'], 'Export MongoDB collection from specific database', yargs => {
    yargs
      .positional('dbServer', {
        describe: 'Server where database is running [localhost, nas, atlas]',
        type: 'string',
        default: 'localhost',
        choices: ['localhost', 'nas', 'atlas']
      })
      .positional('logLevel', {
        describe: 'Log level.',
        type: 'string',
        default: 'debug',
        choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
      })
      .positional('collection', {
        describe: 'Collections to export',
        type: 'string',
        choices: ['currencies', 'expenses', 'rates', 'travels', 'users'],
        default: ['currencies', 'expenses', 'rates', 'travels', 'users']
      })
      .help();
  })
  .command(['mongoimport', 'mi', 'import'], 'Import MongoDB collection to specific database', yargs => {
    yargs
      .positional('dbServer', {
        describe: 'Server where database is running [localhost, nas, atlas]',
        type: 'string',
        default: 'localhost',
        choices: ['localhost', 'nas', 'atlas']
      })
      .positional('logLevel', {
        describe: 'Log level.',
        type: 'string',
        default: 'debug',
        choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
      })
      .positional('collection', {
        describe: 'Collections to export',
        type: 'string',
        choices: ['currencies', 'expenses', 'rates', 'travels', 'users'],
        default: ['currencies', 'expenses', 'rates', 'travels', 'users']
      })
      .positional('folder', {
        describe: 'Folder where json files are located [localhost, nas, atlas]',
        type: 'string',
        default: 'localhost',
        choices: ['localhost', 'nas', 'atlas']
      })
      .help();
  })
  .command(['mongorestore', 'mr', 'restore'], 'Restore MongoDB database to specific datbase', yargs => {
    yargs
      .positional('dbServer', {
        describe: 'Server where database is running [localhost, nas, atlas]',
        type: 'string',
        default: 'localhost',
        choices: ['localhost', 'nas', 'atlas']
      })
      .positional('logLevel', {
        describe: 'Log level.',
        type: 'string',
        default: 'debug',
        choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
      })
      .positional('folder', {
        describe: 'Folder where json files are located [localhost, nas, atlas]',
        type: 'string',
        default: `mongodump-${moment().format('YYYY-M-D')}`
      })
      .help();
  })
  .options({
    dbServer: {
      alias: 'dbs',
      description: 'Server where database is running [localhost, nas, atlas]',
      type: 'string',
      default: 'localhost',
      choices: ['localhost', 'nas', 'atlas']
    }
  })
  .array('collection')
  .demandCommand(1)
  .help()
  .group('dbServer', 'Specific options');

console.dir(argv);

// Load environment variables from .env file, where API keys and passwords are configured.
const env = dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenvExpand(env);
if (env.error) {
  throw env.error;
}

const LoggerClass = require('./config/LoggerClass');

const Logger = new LoggerClass('mongoCLT');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\mongoCLT INITIALIZING!');

if (argv._.length === 0) {
  mainLogger.error('Not valid command!');
  process.exit();
}

mainLogger.debug(argv._[0], { label: 'argv._[0]' });


const { db } = require('./config');
const { RUNNING_PLATFORM, OS_COMMANDS } = require('./lib/constants');
const getDbOptions = require('./utils/dbBackup/getDbOptions');

const dbOptions = getDbOptions(db);
const bckDirPath = appRoot.resolve('dbBackup');
let backupDirPath;
let backupFilePath;

// console.log(argv.collection, typeof argv.collection);

// determine proper cmd command - for the moment only win32 or linux
let exeFilePath;
switch (argv._[0]) {
  case 'mongoexport':
  case 'me':
  case 'export':
    exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongoexport;
    backupDirPath = path.join(bckDirPath, 'JSON');
    break;
  case 'mongoimport':
  case 'mi':
  case 'import':
    exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongoimport;
    backupDirPath = path.join(bckDirPath, 'JSON');
    break;
  case 'mongorestore':
  case 'mr':
  case 'restore':
    exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongorestore;
    backupDirPath = path.join(bckDirPath, 'database-backup');
    break;
  default:
    mainLogger.warn(argv._[0], { label: 'Wrong 1st argument' });
    process.exit();
}

mainLogger.debug(exeFilePath, { label: 'exeFilePath' });
mainLogger.debug(backupDirPath, { label: 'backupDirPath' });

const mongoExport = (
  command = exeFilePath, folder = argv.dbServer, collection = argv.collection
) => {
// Command for mongodb mongoexport process
  const label = 'mongoExport';
  logger.debug('mongoExport Starts', { label });
  const cmdOptions = ['host', 'readPreference', 'port', 'ssl', 'username', 'password', 'authenticationDatabase', 'db'];
  let cmd = `${command} `;

  collection.forEach(value => {
    cmd += `--collection ${value} `;
    cmdOptions.forEach(key => {
      if (key === 'ssl' && dbOptions[key] === 'true') {
        cmd += '--ssl ';
        logger.silly(`--${key}`, { label: key });
      }
      if (dbOptions[key] && key !== 'ssl') {
        cmd += `--${key} ${dbOptions[key]} `;
        switch (key) {
          case 'password':
            mainLogger.silly(`--${key}: ***********`, { label });
            break;
          default:
            logger.silly(`--${key}: ${dbOptions[key]}`, { label });
            break;
        }
      }
    });
    backupFilePath = `${backupDirPath}\\${folder}\\${value}.json`;
    cmd += `--out ${backupFilePath} -v`;
    logger.silly(`--out: ${backupFilePath}`, { label });
    logger.debug(cmd, { label });

    exec(cmd, (error, stderr, stdout) => {
      const label = `exec ${argv._[0]}`;
      logger.debug('exec STARTS', { label });
      if (error) {
        logger.error(error.message, { label });
        console.dir(error);
      }

      if (stdout) {
        stdout.split('\n').forEach(value => {
          logger.info(value, { label: 'exec stdout' });
        });
      }

      if (stderr) {
        logger.error(stderr, { label });
        console.log(typeof stderr);
      }
      logger.debug('exec ENDS', { label });
    });

    cmd = `${command} `;
  });
  logger.debug('mongoExport ENDS', { label });
};

const mongoImport = (
  command = exeFilePath, folder = argv.folder, collection = argv.collection
) => {
  const label = 'mongoImport';
  logger.debug('mongoImport STARTS', { label });
  const cmdOptions = ['host', 'readPreference', 'port', 'ssl', 'username', 'password', 'authenticationDatabase', 'db'];
  let cmd = `${command} `;

  collection.forEach(value => {
    cmd += `--collection ${value} --mode merge `;
    cmdOptions.forEach(key => {
      if (key === 'ssl' && dbOptions[key] === 'true') {
        cmd += '--ssl ';
        logger.silly(`--${key}`, { label: key });
      }
      if (dbOptions[key] && key !== 'ssl') {
        cmd += `--${key} ${dbOptions[key]} `;
        switch (key) {
          case 'password':
            mainLogger.silly(`--${key}: ***********`, { label });
            break;
          default:
            logger.silly(`--${key}: ${dbOptions[key]}`, { label });
            break;
        }
      }
    });
    backupFilePath = `${backupDirPath}\\${folder}\\${value}.json`;
    cmd += `--file ${backupFilePath} -v`;
    logger.silly(`--file: ${backupFilePath}`, { label });
    logger.debug(cmd, { label });

    exec(cmd, (error, stderr, stdout) => {
      const label = `exec ${argv._[0]}`;
      logger.debug('exec STARTS', { label });
      if (error) {
        logger.error(error.message, { label });
        console.dir(error);
      }

      if (stdout) {
        stdout.split('\n').forEach(value => {
          logger.info(value, { label: 'exec stdout' });
        });
      }

      if (stderr) {
        logger.error(stderr, { label });
        console.log(typeof stderr);
      }
      logger.debug('exec ENDS', { label });
    });

    cmd = `${command} `;
  });
  logger.debug('mongoImport ENDS', { label });
};

const mongoRestore = (command = exeFilePath, folder = argv.folder) => {
  const label = 'mongoRestore';
  logger.debug('mongoRestore STARTS', { label });
  const cmdOptions = ['host', 'readPreference', 'port', 'ssl', 'username', 'password', 'authenticationDatabase', 'db'];
  let cmd = `${command} `;
  cmdOptions.forEach(key => {
    if (key === 'ssl' && dbOptions[key] === 'true') {
      cmd += '--ssl ';
      logger.silly(`--${key}`, { label: key });
    }
    if (dbOptions[key] && key !== 'ssl' && key !== 'db') {
      cmd += `--${key} ${dbOptions[key]} `;
      switch (key) {
        case 'password':
          mainLogger.silly(`--${key}: ***********`, { label });
          break;
        default:
          logger.silly(`--${key}: ${dbOptions[key]}`, { label });
          break;
      }
    }
  });
  backupFilePath = `${backupDirPath}-${folder}`;
  cmd += `-v ${backupFilePath}/`;
  logger.silly(`${backupFilePath}`, { label });
  logger.debug(cmd, { label });

  exec(cmd, (error, stderr, stdout) => {
    const label = `exec ${argv._[0]}`;
    logger.debug('exec STARTS', { label });
    if (error) {
      logger.error(error.message, { label });
      console.dir(error);
    }

    if (stdout) {
      stdout.split('\n').forEach(value => {
        logger.info(value, { label: 'exec stdout' });
      });
    }

    if (stderr) {
      logger.error(stderr, { label });
      console.log(typeof stderr);
    }
    logger.debug('exec ENDS', { label });
  });

  logger.debug('mongoRestore ENDS', { label });
};

// Run specific function
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
    process.exit();
}
