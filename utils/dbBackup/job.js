const schedule = require('node-schedule');

const dbBackup = require('./backup');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('job');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\job INITIALIZING!');

module.exports = async () => {
  const label = 'backup/job';
  logger.debug('Creating db backup job START', { label });
  const rule = new schedule.RecurrenceRule();
  // rule.second = 1;
  rule.minute = 1;
  rule.hour = 1;
  rule.dayOfWeek = 0;
  const scheduleId = 'db backup job';

  dbBackup.dbAutoBackUp();

  // TODO remove async?
  const job = schedule.scheduleJob(scheduleId, rule, async () => {
    const jobLabel = 'db backup job';
    logger.debug('db backupjob START', jobLabel);
    dbBackup.dbAutoBackUp();
    logger.debug('db backupjob END', jobLabel);
  });

  logger.debug('Creating db backup job END', { label });
  return job;
};
