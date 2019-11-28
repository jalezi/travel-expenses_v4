const { isAuthenticated } = require('../../config/passport');
const userController = require('../../controllers/user');
const { addLogger } = require('../logger');

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = app => {
  Logger.debug('User routes initializing');
  app.get('/login', userController.getLogin);
  app.post('/login', userController.postLogin);
  app.get('/logout', userController.logout);
  app.get('/forgot', userController.getForgot);
  app.post('/forgot', userController.postForgot);
  app.get('/reset/:token', userController.getReset);
  app.post('/reset/:token', userController.postReset);
  app.get('/signup', userController.getSignup);
  app.post('/signup', userController.postSignup);

  app.get('/account', isAuthenticated, userController.getAccount);
  app.post(
    '/account/profile',
    isAuthenticated,
    userController.postUpdateProfile
  );
  app.post(
    '/account/password',
    isAuthenticated,
    userController.postUpdatePassword
  );
  app.post(
    '/account/delete',
    isAuthenticated,
    userController.postDeleteAccount
  );
  app.get(
    '/account/unlink/:provider',
    isAuthenticated,
    userController.getOauthUnlink
  );
};
