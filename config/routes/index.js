const passport = require('passport');

const { addLogger } = require('..//logger');

const homeController = require('../../controllers/home');
const userController = require('../../controllers/user');
const contactController = require('../../controllers/contact');
const travelController = require('../../controllers/travel');
const expenseController = require('../../controllers/expense');
const importController = require('../../controllers/import');

const passportConfig = require('../../config/passport');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = app => {
  Logger.debug('Routes initialzing');
  app.get('/', homeController.index);
  app.get('/login', userController.getLogin);
  app.post('/login', userController.postLogin);
  app.get('/logout', userController.logout);
  app.get('/forgot', userController.getForgot);
  app.post('/forgot', userController.postForgot);
  app.get('/reset/:token', userController.getReset);
  app.post('/reset/:token', userController.postReset);
  app.get('/signup', userController.getSignup);
  app.post('/signup', userController.postSignup);
  app.get('/contact', contactController.getContact);
  app.post('/contact', contactController.postContact);
  app.get(
    '/account',
    passportConfig.isAuthenticated,
    userController.getAccount
  );
  app.post(
    '/account/profile',
    passportConfig.isAuthenticated,
    userController.postUpdateProfile
  );
  app.post(
    '/account/password',
    passportConfig.isAuthenticated,
    userController.postUpdatePassword
  );
  app.post(
    '/account/delete',
    passportConfig.isAuthenticated,
    userController.postDeleteAccount
  );
  app.get(
    '/account/unlink/:provider',
    passportConfig.isAuthenticated,
    userController.getOauthUnlink
  );

  app.get(
    '/travels',
    passportConfig.isAuthenticated,
    travelController.getTravels
  );
  app.get(
    '/travels/new',
    passportConfig.isAuthenticated,
    travelController.getNewTravel
  );
  app.post(
    '/travels/new',
    passportConfig.isAuthenticated,
    travelController.postNewTravel
  );
  app.get(
    '/travels/total_pdf',
    passportConfig.isAuthenticated,
    travelController.getTravelsTotalPDF
  );
  app.get(
    '/travels/:id',
    passportConfig.isAuthenticated,
    travelController.getTravel
  );
  app.delete(
    '/travels/:id',
    passportConfig.isAuthenticated,
    travelController.deleteTravel
  );
  app.patch(
    '/travels/:id',
    passportConfig.isAuthenticated,
    travelController.updateTravel
  );
  app.post(
    '/travels/:id/expenses/new',
    passportConfig.isAuthenticated,
    expenseController.postNewExpense
  );
  app.get(
    '/travels/:id/expenses/:id',
    passportConfig.isAuthenticated,
    expenseController.getExpense
  );
  app.patch(
    '/travels/:id/expenses/:id',
    passportConfig.isAuthenticated,
    expenseController.updateExpense
  );
  app.delete(
    '/travels/:id/expenses/:id',
    passportConfig.isAuthenticated,
    expenseController.deleteExpense
  );
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
  app.get(
    '/travels/:id/pdf',
    passportConfig.isAuthenticated,
    travelController.getTravelExpensesPDF
  );

  /**
   * OAuth authentication routes. (Sign in)
   */
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: 'profile email'
    })
  );
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }),
    (req, res) => {
      res.redirect(req.session.returnTo || '/');
    }
  );
};
