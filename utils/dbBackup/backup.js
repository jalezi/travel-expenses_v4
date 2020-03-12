/* eslint-disable eqeqeq */
const fs = require('fs');
const _ = require('lodash');
const { exec } = require('child_process');
const path = require('path');
const appRoot = require('app-root-path');

const { db } = require('../../config');
const { OS_COMMANDS } = require('../../lib/constants');
const getDbOptions = require('./getDbOptions');
const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('backup');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\backup INITIALIZING!');

// Concatenate root directory path with our backup folder.
const bckDirPath = appRoot.resolve('dbBackup');
const backupDirPath = path.join(bckDirPath, 'database-backup');

getDbOptions(db);
const dbOptions = {
  // user: 'myAdmin',
  // pass: 'Minka-006',
  host: 'localhost',
  port: 27017,
  database: 'test_travel_expenses',
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: backupDirPath
};

// return stringDate as a date object.
exports.stringToDate = dateString => new Date(dateString);


// Check if variable is empty or not.
exports.empty = mixedVar => {
  const label = 'empty';
  logger.debug('empty function STARTS', { label });
  logger.silly(`mixedVar=${mixedVar}`, { label });
  let undef;
  let key;
  const emptyValues = [undef, null, false, 0, '', '0'];
  logger.debug('for index loop array STARTS', { label });
  for (let i = 0; i < emptyValues.length; i++) {
    if (mixedVar === emptyValues[i]) {
      logger.silly(`mixedVar in emptyValue array, index: ${i}`, { label });
      logger.debug('empty function returns TRUE', { label });
      return true;
    }
  }

  if (typeof mixedVar === 'object') {
    logger.debug('mixedVar is object');
    for (key in mixedVar) {
      logger.silly(`key in mixedVar: ${key}`);
      logger.debug('empty function returns FALSE', { label });
      return false;
    }

    logger.debug('empty function returns TRUE', { label });
    return true;
  }

  logger.debug('empty function returns FALSE', { label });
  return false;
};

// Auto backup function
exports.dbAutoBackUp = () => {
  const label = 'dbAutoBackUp';
  logger.debug('abAutoBackUp function STARTS', { label });
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

    // // Command for mongodb dump process
    // let cmd =
    // `mongodump --host ${
    //   dbOptions.host
    // } --port ${
    //   dbOptions.port
    // } --db ${
    //   dbOptions.database
    // } --username ${
    //   dbOptions.user
    // } --password ${
    //   dbOptions.pass
    // } --out ${
    //   newBackupPath}`;

    // Command for mongodb dump process
    let cmd =
       `"C:\\Program Files\\MongoDB\\Server\\4.2\\bin\\mongodump.exe" --host ${
         dbOptions.host
       } --port ${
         dbOptions.port
       } --db ${
         dbOptions.database
       } --out ${
         newBackupPath}`;

    logger.info(`cmd: ${cmd}`, label);

    exec(cmd, (error, stderr, stdout) => {
      const label = 'exec';
      logger.debug('exec STARTS', { label });
      console.log('dbOptions', dbOptions);
      if (error) {
        logger.error(error.message);
      }
      console.log('error', error);
      if (this.empty(error)) {
        // check for remove old backup after keeping # of days given in configuration.
        if (dbOptions.removeOldBackup == true) {
          logger.debug('Remove old backup STARTS', { label });
          if (fs.existsSync(oldBackupPath)) {
            logger.debug(`${oldBackupPath} exists`, { label });
            exec(`rmdir /Q /S ${oldBackupPath}`, err => { // linux rm -rf
              logger.debug('Removing old backup path.', { label });
              if (err) {
                logger.error(err);
                // console.log(err);
              } else {
                logger.info('Old backup path removed!');
              }
            });
          }
          logger.debug('Remove old backup ENDS', { label });
        }
      }
      if (stderr) {
        logger.error(stderr);
      }
      if (stdout) {
        logger.info(stdout);
      }
      logger.debug('exec ENDS', { label });
    });
  }
  logger.debug('abAutoBackUp function ENDS', { label });
};
