const { isAuthenticated } = require('../../config/passport');
const travelController = require('../../controllers/travel');
const { addLogger } = require('../logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = app => {
  Logger.debug('Travels routes initializing');
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
