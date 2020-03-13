const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('backup');
const { mainLogger, logger } = Logger;
mainLogger.debug('utils\\backup\\getDbOptions INITIALIZING!');

module.exports = dbData => {
  const label = 'getDbOptions';
  logger.silly('Exporting db options', { label });
  const result = {};
  const {
    uri,
    srv,
    user,
    pwd,
    host,
    name,
    port,
    auth,
    ssl,
    rp
  } = dbData;
  result.uri = uri;
  result.srv = srv;
  result.username = user === ' ' ? undefined : user;
  result.password = pwd === ' ' ? undefined : pwd;
  result.host = host;
  result.db = name;
  result.port = port;
  result.authenticationDatabase = auth === ' ' ? undefined : auth;
  result.ssl = ssl;
  // result.readPreference = rp === ' ' ? undefined : rp;
  return result;
};
