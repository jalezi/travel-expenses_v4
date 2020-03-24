const LoggerClass = require('../../config/LoggerClass');

const Logger = new LoggerClass('importMiddleware');
const { mainLogger, logger } = Logger;

const Travel = require('../../models/Travel');

mainLogger.debug('utils/middleware/importMiddleware INITIALIZING!');

/**
 * Save to res.locals.travels all user travel, sorted by dateFrom ascending
 */
module.exports = async (req, res, next) => {
  logger.silly('importMiddleware');
  try {
    const travels = await Travel.find({
      _user: req.user._id,
      _id: { $in: req.user.travels }
    })
      .populate({
        path: 'expenses',
        populate: { path: 'curRate' }
      })
      .sort({ dateFrom: 1 });
    res.locals.travels = travels;
    logger.debug(`res.locals.travel.length: ${travels.length}`);
    next();
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};
