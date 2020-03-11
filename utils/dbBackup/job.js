const schedule = require('node-schedule');

const dbBackup = require('./backup');

const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('job');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\job INITIALIZING!');

module.exports = async () => {
  const label = 'backup/job';
  logger.debug('Creating db backup job STARTS', label);
  const rule = new schedule.RecurrenceRule();
  // rule.second = 1;
  rule.minute = 1;
  rule.hour = 1;
  rule.dayOfWeek = 0;
  const scheduleId = 'db backup job';

  const job = schedule.scheduleJob(scheduleId, rule, async () => {
    const jobLabel = 'db backup job';
    logger.debug('db backupjob STARTS', jobLabel);
    dbBackup.dbAutoBackUp();
    logger.debug('db backupjob ENDS', jobLabel);
  });

  logger.debug('Creating db backup job ENDS');
  return job;
};
