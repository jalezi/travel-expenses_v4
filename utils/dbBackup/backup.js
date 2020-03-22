/* eslint-disable eqeqeq */
const { exec } = require('child_process');

const {
  RUNNING_PLATFORM,
  OS_COMMANDS,
  DB_BCK_OPTIONS,
  CMD_OPTIONS
} = require('../../lib/constants');

// backup paths, remove old backup folder, set CMD
const { getBackupPaths, removeOldBck, setCMD } = require('./utils');
// log stdout and stderr function
const { logStd, cpListen } = require('./utils');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('backup');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\backup INITIALIZING!');

// determine proper cmd command - for the moment only win32 or linux
const { mongodump } = OS_COMMANDS[RUNNING_PLATFORM];

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
      logger.silly(`mixedVar in emptyValue array, index: ${i}, ${mixedVar}`, {
        label
      });
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
  if (DB_BCK_OPTIONS.autoBackup == true) {
    const { oldBackupPath, newBackupDir } = getBackupPaths();

    let cmd = `${mongodump} `;
    cmd = setCMD(cmd, CMD_OPTIONS, undefined, newBackupDir, 'out', true);
    logger.debug(cmd, { label });

    const cpExec = exec(cmd, (error, stdout, stderr) => {
      const label = 'exec mongodump cb';
      logger.debug('exec callback START', { label });
      if (error) {
        logger.error(error.message, { label });
        logger.error(stderr);
      } else {
        logger.info('No error', { label });
        logStd(stdout, 'exec stdout', 'silly');
        logStd(stderr, 'exec stderr', 'silly');
      }

      if (this.empty(error)) {
        // check for remove old backup after keeping # of days given in configuration.
        if (DB_BCK_OPTIONS.removeOldBackup == true) {
          logger.debug('Remove old backup START', { label });
          removeOldBck(oldBackupPath);
          logger.debug('Remove old backup END', { label });
        }
      }
      logger.debug('exec callback END', { label });
    });

    // childprocess events listen
    cpListen(cpExec, label);
  }
  logger.debug('abAutoBackUp function END', { label });
};
