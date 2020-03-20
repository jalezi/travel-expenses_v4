const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('utils');
const { mainLogger, logger } = Logger;

mainLogger.info('utils INITIALIZING');

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
