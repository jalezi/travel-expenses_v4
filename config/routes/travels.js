const LoggerClass = require('../LoggerClass');

const Logger = new LoggerClass('travels');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\routes\\travels  INITIALIZING!');

const { isAuthenticated } = require('../../config/passport');
const travelController = require('../../controllers/travel');

/**
 * Defines Travels routes.
 * @module config/routes/travels
 * @requires module:config/LoggerClass
 * @requires module:config/passport
 * @requires module:controllers/travel
 */

/**
 * Travels Routes.
 * @param {Express} app
 */
module.exports = app => {
  logger.debug('Travels routes initializing');
  app.get(
    '/travels',
    isAuthenticated,
    travelController.getTravels
  );
  app.get(
    '/travels/new',
    isAuthenticated,
    travelController.getNewTravel
  );
  app.post(
    '/travels/new',
    isAuthenticated,
    travelController.postNewTravel
  );
  app.get(
    '/travels/total_pdf',
    isAuthenticated,
    travelController.getTravelsTotalPDF
  );
  app.get(
    '/travels/:id',
    isAuthenticated,
    travelController.getTravel
  );
  app.delete(
    '/travels/:id',
    isAuthenticated,
    travelController.deleteTravel
  );
  app.patch(
    '/travels/:id',
    isAuthenticated,
    travelController.updateTravel
  );
  app.get(
    '/travels/:id/pdf',
    isAuthenticated,
    travelController.getTravelExpensesPDF
  );
};
