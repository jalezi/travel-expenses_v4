const { addLogger } = require('../../loaders/logger');
const Travel = require('../../models/Travel');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

/**
 * Save to res.locals.travels all user travel, sorted by dateFrom ascending
 */
module.exports = async (req, res, next) => {
  Logger.silly('importMIddleware');
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
    next();
  } catch (err) {
    next(err);
  }
};
