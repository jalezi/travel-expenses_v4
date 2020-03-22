const { exec } = require('child_process');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('dbBackupUtils');
const { mainLogger, logger } = Logger;

mainLogger.info('dbBackupUtils INITIALIZING');

const { argv } = require('./getYargs');
const { RUNNING_PLATFORM, OS_COMMANDS } = require('../../lib/constants');
const { logStd, cpListen, setCMD } = require('./utils');
const { CMD_OPTIONS } = require('../../lib/constants');

// determine proper cmd command - for the moment only win32 or linux
exports.getExeAndBackupDirPath = () => {
  const label = 'getExeAndBackupDirPath';
  logger.debug('getExeAndBackupDirPath START', { label });
  // let backupDirPath;
  let exeFilePath;
  let outOrFile;

  switch (argv._[0]) {
    case 'mongoexport':
    case 'me':
    case 'export':
      exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongoexport;
      outOrFile = 'out';
      break;
    case 'mongoimport':
    case 'mi':
    case 'import':
      exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongoimport;
      outOrFile = 'file';
      break;
    case 'mongorestore':
    case 'mr':
    case 'restore':
      exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongorestore;
      break;
    case 'mongodump':
    case 'md':
    case 'dump':
      exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongodump;
      outOrFile = 'out';
      break;
    default:
      mainLogger.warn(argv._[0], { label: 'Wrong 1st argument' });
      process.exit(9);
  }

  return { exeFilePath, outOrFile };
};

const { outOrFile } = this.getExeAndBackupDirPath();

// run exec
exports.execFunc = cmd => {
  const label = 'execFunc';
  logger.debug('execFunc START', { label });
  const cpExec = exec(cmd, (error, stdout, stderr) => {
    const label = `exec ${argv._[0]} cb`;
    logger.debug('exec callback START', { label });
    if (error) {
      logger.error(error.message, { label });
      logger.error(stderr, { label: 'exec stderr' });
    } else {
      logger.info('No error', { label });
      logStd(stdout, 'exec stdout', 'silly');
      logStd(stderr, 'exec stderr', 'silly');
    }

    logger.debug('exec callback END', { label });
  });

  // childprocess listen
  cpListen(cpExec, label);

  logger.debug('execFunc END', { label });
};

// Loop trough collections to export or import

exports.loopCollections = (command, collection, folder, mode) => {
  const label = 'loopCollections';
  logger.debug('loopCollections START', { label });
  let cmd = `${command} `;
  collection.forEach(value => {
    cmd += `--collection ${value} `;
    // When mongoimport we want to pass additional variable --mode=<insert|upsert|merge>
    // see: https://docs.mongodb.com/manual/reference/program/mongoimport/
    if (mode) {
      cmd += `--mode ${mode} `;
    }
    cmd = setCMD(cmd, CMD_OPTIONS, value, folder, outOrFile);
    logger.debug(cmd, { label });
    if (cmd) {
      this.execFunc(cmd);
    } else {
      logger.warn('Something went wrong! No command!');
    }
    cmd = `${command} `;
  });
  logger.debug('loopCollections END', { label });
};
