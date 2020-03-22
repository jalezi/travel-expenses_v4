const fs = require('fs');
const { exec } = require('child_process');
const moment = require('moment');

const { db } = require('../../config');
const getDbOptions = require('./getDbOptions');
const { OS_COMMANDS, RUNNING_PLATFORM, DB_BCK_OPTIONS } = require('../../lib/constants');
const { BCK_BIN_DIR_PATH, BCK_DATA_DIR_PATH } = require('../../lib/constants').BCK_PATHS;

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('utils');
const { mainLogger, logger } = Logger;

mainLogger.info('utils INITIALIZING');

// return database options
exports.dbOptions = getDbOptions(db);


// return new and old dates in object as string
exports.bckDates = (date = new Date()) => {
  const label = 'bckDates';
  logger.debug('bckDates START', { label });
  const result = {};
  const subtractDays = DB_BCK_OPTIONS.keepLastDaysBackup;
  result.newDate = moment(date).format('YYYY-MM-DD');
  result.oldDate = moment(date).subtract(subtractDays, 'days').format('YYYY-MM-DD');
  logger.silly(`newDate = ${result.newDate}`, { label });
  logger.silly(`oldDate = ${result.oldDate}`, { label });
  logger.debug('bckDates END', { label });
  return result;
};


// get backup paths
exports.getBackupPaths = (specilaPath = 'mongodump') => {
  const label = 'getBackupPaths';
  logger.debug('getBackupPaths START', { label });

  const { newDate, oldDate } = this.bckDates();
  const { autoBackupPath } = DB_BCK_OPTIONS;
  let oldBackupDir;
  let oldBackupPath;

  // Current date
  const newBackupDir = `${specilaPath}-${newDate}`;
  logger.silly(`newBackupDir: ${newBackupDir}`, { label });

  // New backup path for current backup process
  let newBackupPath = `${autoBackupPath}-${newBackupDir}`;
  logger.silly(`newBackupPath: ${newBackupPath}`, { label });

  // check for remove old backup after keeping # of days given in configuration
  if (DB_BCK_OPTIONS.removeOldBackup === true) {
    oldBackupDir = `${specilaPath}-${oldDate}`;
    logger.silly(`oldBackupDir: ${oldBackupDir}`, { label });

    // old backup(after keeping # of days)
    oldBackupPath = `${autoBackupPath}-${oldBackupDir}`;
    logger.silly(`oldBackupPath: ${oldBackupPath}`, { label });
  }
  logger.debug('getBackupPaths END', { label });
  return { oldBackupPath, newBackupPath, oldBackupDir, newBackupDir };
};

// Remove old backup function
exports.removeOldBck = oldBackupPath => {
  const label = 'removeOldBck';
  logger.debug('removeOldBck START', { label });
  const delCmdObj = OS_COMMANDS[RUNNING_PLATFORM].delete;
  const delCmd = delCmdObj.cmd;
  const delCmdOpt = delCmdObj.options;
  const deleteCmd = `${delCmd} ${delCmdOpt}`;
  logger.silly(`${RUNNING_PLATFORM} CMD delete command: ${deleteCmd}`, { label });

  if (fs.existsSync(oldBackupPath)) {
    logger.debug(`${oldBackupPath} exists`, { label });
    const execCMD = `${deleteCmd} ${oldBackupPath}`; // linux rm -rf win32 rmdir /Q /S
    logger.debug('Removing old backup path.', { label });

    const cpExecDel = exec(execCMD, (err, stdout, stderr) => {
      const label = `exec ${deleteCmd} cb`;
      logger.debug('exec callback START', { label });
      if (err) {
        logger.error(err.message);
        logger.error(stderr, { label: 'exec stderr' });
      } else {
        logger.info('No error', { label });
        this.logStd(stdout, 'exec stdout', 'silly');
        this.logStd(stderr, 'exec stderr', 'silly');
        logger.info('Old backup path removed!', { label });
      }
      logger.debug('exec callback END', { label });
    });

    // childprocess listen
    this.cpListen(cpExecDel, label);
  }

  logger.debug('removeOldBck END', { label });
};

// Log stdout or stderr with custom logger
exports.logStd = (data, label = 'stderr', level) => {
  data.split('\n').forEach(value => {
    let stderrArr = value.split('\t');
    let msg = stderrArr[1];
    if (msg) {
      switch (level) {
        case 'silly':
          logger.silly(msg, { label });
          break;
        case 'debug':
          logger.debug(msg, { label });
          break;
        case 'verbose':
          logger.verbose(msg, { label });
          break;

        default:
          logger.info(msg, { label });
          break;
      }
    }
  });
};

// Listen to childprocess and stdout/stderr events
exports.cpListen = (
  cp,
  label,
  close = true,
  exit = true,
  error = true,
  stdout = true,
  stderr = true
) => {
  // get pid
  const { pid } = cp;
  logger.debug(pid.toString(), { label: 'cp pid' });

  // listen on childprocess events
  if (close) {
    cp.on('close', (code, signal) => {
      logger.debug(`${pid} closed with code: ${code} and signal: ${signal}`, {
        label
      });
      const argv1 = process.argv[1];
      const arr = argv1.split('\\');
      if (arr[arr.length - 1] !== 'app.js' && arr[arr.length - 1] !== 'app') {
        process.exit(1);
      }
    });
  }

  if (exit) {
    cp.on('exit', (code, signal) => {
      logger.debug(`${pid} exit with code: ${code} and signal: ${signal}`, {
        label
      });
    });
  }

  if (error) {
    cp.on('error', error => {
      logger.error(error.message, { label });
    });
  }

  // listen on stdout and stderr
  if (stdout) {
    cp.stdout.on('data', data => {
      this.logStd(data, `process ${pid} stdout`);
    });
  }

  if (stderr) {
    cp.stderr.on('data', data => {
      this.logStd(data, `process ${pid} stderr`);
    });
  }
};

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

const setCmdSpecialOpt = (binaryOrData, folderSuffix, val, option) => {
  const label = 'setCmdSpecialOpt';
  logger.debug('setCmdSpecialOpt START', { label });

  let backupFilePath;
  if (!binaryOrData) {
    backupFilePath = `${BCK_DATA_DIR_PATH}\\${folderSuffix}\\${val}.json`;
    logger.silly(`--${option}: ${backupFilePath}`, { label });
    logger.debug('setCmdSpecialOpt END', { label });
    return `--${option} ${backupFilePath}`;
  }
  if (option === 'out') {
    backupFilePath = `${BCK_BIN_DIR_PATH}-${folderSuffix}`;
    logger.silly(`--out ${backupFilePath}`, { label });
    logger.debug('setCmdSpecialOpt END', { label });
    return `--${option} ${backupFilePath}`;
  }
  backupFilePath = `${BCK_BIN_DIR_PATH}-${folderSuffix}`;
  logger.silly(`${backupFilePath}`, { label });
  logger.debug('setCmdSpecialOpt END', { label });
  return `${backupFilePath}/`;
};


// set command
exports.setCMD = (commandTextBegin, cmdOpt, value, folder, specialOpt, binExpImpTool = false) => {
  const label = 'setCMD';
  logger.debug('setCMD START', { label });

  logger.debug('setCMD variable', { label });

  if (!binExpImpTool && !checkSpecialOpt(specialOpt)) {
    logger.debug('setCMD END', { label });
    return;
  }

  let cmd = commandTextBegin;

  cmdOpt.forEach(key => {
    // mongorestore does not require --db
    if (binExpImpTool && key === 'db' && !specialOpt) {
      return;
    }
    // --ssl with no value
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
  cmd += '-v ';
  cmd += setCmdSpecialOpt(binExpImpTool, folder, value, specialOpt);
  logger.silly(cmd, { label });
  logger.debug('setCMD END', { label });
  return cmd;
};
