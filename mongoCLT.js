const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const { exec } = require('child_process');
const appRoot = require('app-root-path');
const path = require('path');
const moment = require('moment');
const { argv } = require('yargs')
  .command(['mongoexport [options]', 'me', 'export'], 'Export MongoDB collection from specific database', yargs => {
    yargs.help();
  })
  .command(['mongoimport [options]', 'mi', 'import'], 'Import MongoDB collection to specific database', yargs => {
    yargs
      .positional('folder', {
        describe: 'Folder where json files are located [localhost, nas, atlas]',
        type: 'string',
        default: 'localhost',
        choices: ['localhost', 'nas', 'atlas']
      })
      .help();
  })
  .command(['mongorestore [options]', 'mr', 'restore'], 'Restore MongoDB database to specific datbase', yargs => {
    yargs
      .positional('folder', {
        describe: 'Folder where mongorestore dump files are.',
        type: 'string',
        default: `mongodump-${moment().format('YYYY-M-D')}`
      })
      .help();
  })
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

mainLogger.silly(JSON.stringify(argv), { label: 'yargs.argv' });

if (argv._.length === 0) {
  mainLogger.error('Not valid command!');
  process.exit(9);
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
    process.exit(9);
}

mainLogger.debug(exeFilePath, { label: 'exeFilePath' });
mainLogger.debug(backupDirPath, { label: 'backupDirPath' });

const cmdOptions = ['host', 'readPreference', 'port', 'ssl', 'username', 'password', 'authenticationDatabase', 'db'];

const setCMD = (commandTextBegin, cmdOpt, value, folder, specialOpt) => {
  const label = 'setCMD';
  logger.debug('setCMD START', { label });
  if (!['file', 'out'].includes(specialOpt)) {
    return;
  }
  let cmd = commandTextBegin;

  cmdOpt.forEach(key => {
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
  cmd += `--${specialOpt} ${backupFilePath} -v`;
  logger.silly(`--${specialOpt}: ${backupFilePath}`, { label });
  logger.silly(cmd, { label });
  logger.debug('setCMD END', { label });
  return cmd;
};

const execFunc = cmd => {
  const label = 'execFunc';
  logger.debug('execFunc START', { label });
  const cpExec = exec(cmd, (error, stdout, stderr) => {
    const label = `exec ${argv._[0]}`;
    logger.debug('exec callback START', { label });
    if (error) {
      logger.error(error.message, { label });
      logger.error(stderr, { label: 'exec stderr' });
    } else {
      logger.info('No error', { label });
      stderr.split('\n').forEach(value => {
        let stderrArr = value.split('\t');
        let msg = stderrArr[1];
        if (msg) {
          logger.silly(msg, { label: 'exec stderr' });
        }
      });
    }
    if (stdout) {
      // do something
    }
    if (stderr) {
      // do something
    }
    logger.debug('exec callback END', { label });
  });
  const { pid } = cpExec;
  logger.debug(pid.toString(), { label: 'childprocess pid' });
  cpExec.stdout.on('data', data => {
    logger.info(data, { label: `process ${pid} stdout` });
  });
  cpExec.stderr.on('data', data => {
    data.split('\n').forEach(value => {
      let arr = value.split('\t');
      let msg = arr[1];
      if (msg) {
        logger.info(msg, { label: `process ${pid} stderr` });
      }
    });
  });
  logger.debug('execFunc END', { label });
};

// Loop trough collections to export or import
const loopCollections = (command, collection, folder, mode) => {
  const label = 'loopCollections';
  logger.debug('loopCollections START', { label });
  let cmd = `${command} `;
  let outOrFile = 'out';
  collection.forEach(value => {
    cmd += `--collection ${value} `;
    // When mongoimport we want to pass additional variable --mode=<insert|upsert|merge>
    // see: https://docs.mongodb.com/manual/reference/program/mongoimport/
    if (mode) {
      cmd += `--mode ${mode} `;
      outOrFile = 'file';
    }
    cmd = setCMD(cmd, cmdOptions, value, folder, outOrFile);
    logger.debug(cmd, { label });
    if (cmd) {
      execFunc(cmd);
    } else {
      logger.warn('Something went wrong! No command!');
    }
    cmd = `${command} `;
  });
  logger.debug('loopCollections END', { label });
};


const mongoExport = (
  command = exeFilePath, folder = argv.dbServer, collection = argv.collection
) => {
// Command for mongodb mongoexport process
  const label = 'mongoExport';
  logger.debug('mongoExport Starts', { label });
  loopCollections(command, collection, folder);
  logger.debug('mongoExport END', { label });
};

const mongoImport = (
  command = exeFilePath, folder = argv.folder, collection = argv.collection
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

  execFunc(cmd);

  logger.debug('mongoRestore END', { label });
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
    process.exit(9);
}
