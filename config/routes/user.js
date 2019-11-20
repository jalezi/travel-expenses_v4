const { Router } = require('express');

const { addLogger } = require('../logger');

const route = Router();

// Logger
const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

module.exports = (app: Router) => {
    app.get('/login', userController.getLogin);
    app.post('/login', userController.postLogin);
    app.get('/logout', userController.logout);
    app.get('/forgot', userController.getForgot);
    app.post('/forgot', userController.postForgot);
    app.get('/reset/:token', userController.getReset);
    app.post('/reset/:token', userController.postReset);
    app.get('/signup', userController.getSignup);
    app.post('/signup', userController.postSignup);
}
