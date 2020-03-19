/* eslint-disable eqeqeq */
const fs = require('fs');
const _ = require('lodash');
const { exec } = require('child_process');
const path = require('path');
const appRoot = require('app-root-path');

const { db } = require('../../config');
const { RUNNING_PLATFORM, OS_COMMANDS } = require('../../lib/constants');
const getDbOptions = require('./getDbOptions');
const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('backup');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\backup INITIALIZING!');

// determine proper cmd command - for the moment only win32 or linux
const { mongodump } = OS_COMMANDS[RUNNING_PLATFORM];
const deleteCMD = OS_COMMANDS[RUNNING_PLATFORM].delete.directory.withContent;
mainLogger.silly(`${RUNNING_PLATFORM} CMD delete command: ${deleteCMD}`);

// Concatenate root directory path with our backup folder.
const bckDirPath = appRoot.resolve('dbBackup');
const backupDirPath = path.join(bckDirPath, 'database-backup');

const dbOptionsBasic = {
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: backupDirPath
};

const dbOptionsDynamic = getDbOptions(db);

const dbOptionsMerged = { ...dbOptionsDynamic, ...dbOptionsBasic };

const dbOptions = dbOptionsMerged;

// return stringDate as a date object.
exports.stringToDate = dateString => new Date(dateString);


// Check if variable is empty or not.
exports.empty = mixedVar => {
  const label = 'empty';
  logger.debug('empty function START', { label });
  logger.silly(`mixedVar=${mixedVar}`, { label });
  let undef;
  const emptyValues = [undef, null, false, 0, '', '0'];
  logger.debug('for index loop array START', { label });
  for (let i = 0; i < emptyValues.length; i++) {
    if (mixedVar === emptyValues[i]) {
      logger.silly(`mixedVar in emptyValue array, index: ${i}, ${mixedVar}`, { label });
      logger.debug('empty function returns TRUE', { label });
      return true;
    }
  }

  if (typeof mixedVar === 'object') {
    logger.warn('mixedVar is object', { label });
    Object.keys(mixedVar).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(mixedVar, key)) {
        logger.info(`mixedVar hasOwnProperty: ${key}`);
        logger.silly(`key in mixedVar: ${key}`);
        logger.debug('empty function returns FALSE', { label });
        return false;
      }
    });

    logger.debug('empty function returns TRUE', { label });
    return true;
  }

  logger.debug('empty function returns FALSE', { label });
  return false;
};

// Auto backup function
exports.dbAutoBackUp = () => {
  const label = 'dbAutoBackUp';
  logger.debug('abAutoBackUp function START', { label });
  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup == true) {
    let date = new Date();
    let beforeDate;
    let oldBackupDir;
    let oldBackupPath;

    // Current date
    let currentDate = this.stringToDate(date);
    let newBackupDir =
      `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    logger.silly(`newBackupDir: ${newBackupDir}`, { label });
    // New backup path for current backup process
    let newBackupPath = `${dbOptions.autoBackupPath}-mongodump-${newBackupDir}`;
    logger.silly(`newBackupPath: ${newBackupPath}`, { label });
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir =
        `${beforeDate.getFullYear()}-${beforeDate.getMonth() + 1}-${beforeDate.getDate()}`;
      logger.silly(`oldBackupDir: ${oldBackupDir}`, { label });
      // old backup(after keeping # of days)
      oldBackupPath = `${dbOptions.autoBackupPath}-mongodump-${oldBackupDir}`;
      logger.silly(`oldBackupPath: ${oldBackupPath}`, { label });
    }

    // Command for mongodb dump process
    const cmdOptions = ['host', 'readPreference', 'port', 'ssl', 'username', 'password', 'authenticationDatabase', 'db'];
    let cmd = `${mongodump} `;
    cmdOptions.forEach(key => {
      if (key === 'ssl' && dbOptionsDynamic[key] === 'true') {
        cmd += '--ssl ';
        logger.silly(`--${key}`, { label });
      }
      if (dbOptionsDynamic[key] && key != 'ssl') {
        cmd += `--${key} ${dbOptionsDynamic[key]} `;
        switch (key) {
          case 'password':
            logger.silly(`--${key}: ***********`, { label });
            break;
          default:
            logger.silly(`--${key}: ${dbOptionsDynamic[key]}`, { label });
            break;
        }
      }
    });
    cmd += `--out ${newBackupPath} -v`;
    logger.silly(`--out: ${newBackupPath}`, { label });


    const cpExec = exec(cmd, (error, stdout, stderr) => {
      const label = 'exec mongodump';
      logger.debug('exec callback START', { label });
      if (error) {
        logger.error(error.message, { label });
        logger.error(stderr);
      } else {
        logger.info('No error', { label });
        stderr.split('\n').forEach(value => {
          let arr = value.split('\t');
          let msg = arr[1];
          if (msg) {
            logger.silly(msg, { label: 'exec stderr' });
          }
        });
        stdout.split('\n').forEach(value => {
          let arr = value.split('\t');
          let msg = arr[1];
          if (msg) {
            logger.silly(msg, { label: 'exec stderr' });
          }
        });
      }
      if (this.empty(error)) {
        // check for remove old backup after keeping # of days given in configuration.
        if (dbOptions.removeOldBackup == true) {
          logger.debug('Remove old backup START', { label });
          if (fs.existsSync(oldBackupPath)) {
            logger.debug(`${oldBackupPath} exists`, { label });
            const execCMD = `${deleteCMD} /Q /S ${oldBackupPath}`; // linux rm -rf win32 rmdir /Q /S
            exec(execCMD, err => {
              const label = `exec ${deleteCMD}`;
              logger.debug('Removing old backup path.', { label });
              if (err) {
                logger.error(err);
              } else {
                logger.info('Old backup path removed!', { label });
              }
            });
          }
          logger.debug('Remove old backup END', { label });
        }
      }
      if (stderr) {
        // do something
      }
      if (stdout) {
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
  }
  logger.debug('abAutoBackUp function END', { label });
};
