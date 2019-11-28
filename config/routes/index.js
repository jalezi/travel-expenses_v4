
const { addLogger } = require('..//logger');

const userRoutes = require('./user');
const travelsRoutes = require('./travels');
const expensesRoutes = require('./expenses');
const oAuth = require('./oAuth');

const homeController = require('../../controllers/home');
const contactController = require('../../controllers/contact');
const importController = require('../../controllers/import');

const passportConfig = require('../../config/passport');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = app => {
  Logger.debug('Routes initialzing');
  app.get('/', homeController.index);
  app.get('/contact', contactController.getContact);
  app.post('/contact', contactController.postContact);
  userRoutes(app);
  travelsRoutes(app);
  expensesRoutes(app);
  oAuth(app);

  app.get(
    '/import',
    passportConfig.isAuthenticated,
    importController.getImport
  );
  app.post(
    '/import',
    passportConfig.isAuthenticated,
    importController.postImport
  );
};
