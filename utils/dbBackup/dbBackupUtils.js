const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const appRoot = require('app-root-path');
const path = require('path');
const { exec } = require('child_process');

const env = dotenv.config({ path: appRoot.resolve('.env') });
dotenvExpand(env);
if (env.error) {
  throw env.error;
}

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('dbBackupUtils');
const { mainLogger, logger } = Logger;

mainLogger.info('dbBackupUtils INITIALIZING');

const { argv } = require('../../mongoCLT');
const { db } = require('../../config');
const { RUNNING_PLATFORM, OS_COMMANDS } = require('../../lib/constants');
const getDbOptions = require('./getDbOptions');

exports.dbOptions = getDbOptions(db);

exports.bckDirPath = appRoot.resolve('dbBackup');

// determine proper cmd command - for the moment only win32 or linux
exports.getExeAndBackupDirPath = () => {
  const label = 'getExeAndBackupDirPath';
  logger.debug('getExeAndBackupDirPath START', { label });
  let backupDirPath;
  let exeFilePath;
  let outOrFile;

  switch (argv._[0]) {
    case 'mongoexport':
    case 'me':
    case 'export':
      exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongoexport;
      backupDirPath = path.join(this.bckDirPath, 'JSON');
      outOrFile = 'out';
      break;
    case 'mongoimport':
    case 'mi':
    case 'import':
      exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongoimport;
      backupDirPath = path.join(this.bckDirPath, 'JSON');
      outOrFile = 'file';
      break;
    case 'mongorestore':
    case 'mr':
    case 'restore':
      exeFilePath = OS_COMMANDS[RUNNING_PLATFORM].mongorestore;
      backupDirPath = path.join(this.bckDirPath, 'database-backup');
      break;
    default:
      mainLogger.warn(argv._[0], { label: 'Wrong 1st argument' });
      process.exit(9);
  }

  return { backupDirPath, exeFilePath, outOrFile };
};

const { backupDirPath, outOrFile } = this.getExeAndBackupDirPath();

const checkSpecialOpt = opt => {
  const label = 'checkSpecialOpt';
  logger.debug('checkSpecialOpt START', { label });
  if (!['file', 'out'].includes(opt)) {
    logger.debug('specialOpt should be "out" or "file"');
    logger.debug('checkSpecialOpt END', { label });
    return false;
  }
  return true;
};

// set command
exports.setCMD = (commandTextBegin, cmdOpt, value, folder, specialOpt, binExpImpTool = false) => {
  const label = 'setCMD';
  logger.debug('setCMD START', { label });

  if (!binExpImpTool && !checkSpecialOpt(specialOpt)) {
    logger.debug('setCMD END', { label });
    return;
  }

  // if (!['file', 'out'].includes(specialOpt)) {
  //   logger.debug('specialOpt should be "out" or "file"');
  //   logger.debug('setCMD END', { label });
  //   return;
  // }
  let cmd = commandTextBegin;

  cmdOpt.forEach(key => {
    if (binExpImpTool && key === 'db') {
      return;
    }
    if (key === 'ssl' && this.dbOptions[key] === 'true') {
      cmd += '--ssl ';
      logger.silly(`--${key}`, { label: key });
    }
    if (this.dbOptions[key] && key !== 'ssl') {
      cmd += `--${key} ${this.dbOptions[key]} `;
      switch (key) {
        case 'password':
          mainLogger.silly(`--${key}: ***********`, { label });
          break;
        default:
          logger.silly(`--${key}: ${this.dbOptions[key]}`, { label });
          break;
      }
    }
  });
  let backupFilePath;
  if (!binExpImpTool) {
    backupFilePath = `${backupDirPath}\\${folder}\\${value}.json`;
    cmd += `--${specialOpt} ${backupFilePath} -v`;
  } else {
    backupFilePath = `${backupDirPath}-${folder}`;
    cmd += `-v ${backupFilePath}/`;
  }
  logger.silly(`--${specialOpt}: ${backupFilePath}`, { label });
  logger.silly(cmd, { label });
  logger.debug('setCMD END', { label });
  return cmd;
};


const logStd = (data, label = 'stderr') => {
  data.split('\n').forEach(value => {
    let stderrArr = value.split('\t');
    let msg = stderrArr[1];
    if (msg) {
      logger.info(msg, { label });
    }
  });
};

// run exec
exports.execFunc = cmd => {
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
      logStd(stderr, 'exec stdout');
      logStd(stderr, 'exec stderr');
    }

    logger.debug('exec callback END', { label });
  });

  // get pid
  const { pid } = cpExec;
  logger.debug(pid.toString(), { label: 'childprocess pid' });

  // listen on stdout and stderr
  cpExec.stdout.on('data', data => {
    logStd(data, `process ${pid} stdout`);
  });
  cpExec.stderr.on('data', data => {
    logStd(data, `process ${pid} stderr`);
  });
  logger.debug('execFunc END', { label });
};

// Loop trough collections to export or import
exports.cmdOptions = ['host', 'readPreference', 'port', 'ssl', 'username', 'password', 'authenticationDatabase', 'db'];

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
    cmd = this.setCMD(cmd, this.cmdOptions, value, folder, outOrFile);
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
