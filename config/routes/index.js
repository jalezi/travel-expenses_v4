const LoggerClass = require('../LoggerClass');

const Logger = new LoggerClass('index');
const { mainLogger, logger } = Logger;
mainLogger.debug('config\\routes INITIALIZING!');

const userRoutes = require('./user');
const travelsRoutes = require('./travels');
const expensesRoutes = require('./expenses');
const oAuth = require('./oAuth');

const homeController = require('../../controllers/home');
const contactController = require('../../controllers/contact');
const importController = require('../../controllers/import');

const passportConfig = require('../../config/passport');


/**
 * Defines all routes.
 * @module module:config/routes
 * @author Jaka Daneu
 * @requires module:config/routes/user
 * @requires module:config/routes/travels
 * @requires module:config/routes/expenses
 * @requires module:config/routes/oAuth
 * @requires module:controllers/home
 * @requires module:controllers/contact
 * @requires module:controllers/import
 * @requires module:config/passport
 * @requires module:config/LoggerClass
 */

/**
 * Routes
 * @param {Express} app
 */
module.exports = app => {
  logger.debug('Routes initialzing');
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
