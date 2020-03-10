const fs = require('fs');
const _ = require('lodash');
const { exec } = require('child_process');
const path = require('path');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('backup');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup/backup INITIALIZING!');

// Concatenate root directory path with our backup folder.
const backupDirPath = path.join(__dirname, 'database-backup');
console.log(backupDirPath);


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
  let undef;
  let key;
  let i;
  let len;
  const emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};

// Auto backup function
exports.dbAutoBackUp = () => {
  const label = 'dbAutoBackUp';
  logger.debug('abAutoBackUp function STARTS');
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

    // New backup path for current backup process
    let newBackupPath = `${dbOptions.autoBackupPath}-mongodump-${newBackupDir}`;
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir =
      `${beforeDate.getFullYear()}-${beforeDate.getMonth() + 1}-${beforeDate.getDate()}`;
      // old backup(after keeping # of days)
      oldBackupPath = `${dbOptions.autoBackupPath}mongodump-${oldBackupDir}`;
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

    exec(cmd, (error, stdout, stderr) => {
      console.log('error', error);
      if (this.empty(error)) {
        // check for remove old backup after keeping # of days given in configuration.
        if (dbOptions.removeOldBackup == true) {
          if (fs.existsSync(oldBackupPath)) {
            exec(`rm -rf ${oldBackupPath}`, err => {
              console.log(err);
            });
          }
        }
      }
    });
  }
  logger.debug('abAutoBackUp function ENDS');
};