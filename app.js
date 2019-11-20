/* eslint-disable no-unused-vars */
// jshint esversion: 6
/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('winston');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const cors = require('cors');
const dotenv = require('dotenv');
// const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');

const sass = require('node-sass-middleware');
const multer = require('multer');

const formidable = require('express-formidable');
const expressHbs = require('express-hbs');
// const methodOverride = require('method-override');

require('./utils/hbsHelpers/hbsHelpers');
require('./utils/hbsHelpers/yearsAccordion');
require('full-icu');
const getRates = require('./utils/getRates');

const myErrors = require('./utils/myErrors');

const { ImportFileError } = myErrors;

const { addLogger } = require('./config/logger');
const mongoConnection = require('./config/mongoose');
const methodOverride = require('./utils/middleware/methodOverride');
const redirectAfterLogin = require('./utils/middleware/redirectAfterLogin');
const importMiddleware = require('./utils/middleware/importMiddleware');
const expenseIdMiddleware = require('./utils/middleware/expenseIdMiddleware');
const travelIdMiddleware = require('./utils/middleware/travelIdMiddleware');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Added by me
 * Catch uncaught errors
 */
process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node docs)
});

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const contactController = require('./controllers/contact');
const travelController = require('./controllers/travel');
const expenseController = require('./controllers/expense');
const importController = require('./controllers/import');

/**
 * API keys and Passport configuration.
 */
const config = require('./config');
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

// Set MORGAN logger to use WINSTON stream write
const morganOption = config.envNode === 'development' ? 'dev' : 'combined';
app.use(
  morgan(morganOption, {
    stream: winston.stream.write
  })
);
Logger.silly(`Use morgan with ${morganOption} and winston logger`);

// Connect to MongoDB
mongoConnection();
Logger.silly('Connect to MongoDB');

/**
 * Express configuration.
 */
Logger.debug('Express Configuration');
// Set host, port and views
app.set('host', config.envHost);
app.set('port', config.port);
app.set('views', config.views);
Logger.silly(`Express host: ${app.get('host')}, port: ${app.get('port')}`);
Logger.silly(`Express views: ${app.get('views')}`);

// Set Engine - HBS
app.engine('hbs', expressHbs.express4(config.hbs));
app.set('view engine', '.hbs');
Logger.silly('Express engine set as HBS!');

app.use(compression());

// Set SASS
app.use(sass(config.sass));
const msg = `\n   src: ${config.sass.src},\n   dest: ${config.sass.dest}`;
Logger.silly(`Sass configuration folders:${msg}`);

// Middleware that transforms the raw string of req.body into json or urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set middleware expess-validator
// works with express-validator@5.3.1 and below
// TODO migrate to express-validator@6.2, don't forget controllers folder
app.use(expressValidator());
Logger.silly('Use express-validator middleware');

/**
 * Session data is not saved in the cookie itself,
 * just the session ID. Session data is stored server-side.
 * Since version 1.5.0, the cookie-parser middleware no longer needs
 * to be used for this module to work.
 * This module now directly reads and writes cookies on req/res.
 * Using cookie-parser may result in issues if the secret
 * is not the same between this module and cookie-parser.
 */
app.use(session(config.session));
Logger.silly('Use session middleware');

/**
 * Passport uses the concept of strategies to authenticate requests.
 * Strategies can range from verifying username and password credentials,
 * delegated authentication using OAuth (for example, via Facebook or Twitter),
 * or federated authentication using OpenID.
 * Before authenticating requests,
 * the strategy (or strategies) used by an application must be configured
 */
app.use(passport.initialize());
app.use(passport.session());
Logger.silly('Use passport initialize and session middleware');

// Flash is an extension of connect-flash with the ability to define
//  a flash message and render it without redirecting the request.
app.use(flash());
Logger.silly('Use flash middleware');

// Formidable - A Node.js module for parsing form data, especially file uploads.
app.use('/import', formidable(config.formidable));
app.use('/import', (req, res, next) => {
  if (Object.keys(req.body).length === 0 && req.fields) {
    req.body = req.fields;
  }
  next();
});
Logger.silly(
  'Use formidable middleware & set req.body for route "/import" & set req.body'
);

// Lusca - Web application security middleware.
app.use((req, res, next) => {
  lusca.csrf()(req, res, next);
});
app.use(lusca(config.lusca));
Logger.silly('Use lusca middleware for every response/request');

// At a minimum, disable X-Powered-By header
app.disable('x-powered-by');
Logger.silly('Disable "x-powered-by"');

// Attach user to response from request
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
Logger.silly('Set res.locals.user for every response/request');

// After successful login, redirect back to the intended page
app.use(redirectAfterLogin);
Logger.silly('Set redirection to intended page after successful login');

app.use(
  '/',
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), {
    maxAge: 31557600000
  })
);
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), {
    maxAge: 31557600000
  })
);
app.use(
  '/js/lib',
  express.static(path.join(__dirname, 'node_modules/jquery/dist'), {
    maxAge: 31557600000
  })
);
app.use(
  '/webfonts',
  express.static(
    path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'),
    { maxAge: 31557600000 }
  )
);

// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// It shows the real origin IP in the heroku or Cloudwatch logs
app.enable('trust proxy');
Logger.silly('Enable trust-proxy');

// The magic package that prevents frontend developers going nuts
// Alternate description:
// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());
Logger.silly('Use cors middleware');

// Some sauce that always add since 2014
// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
// Maybe not needed anymore ?
app.use(methodOverride);
Logger.silly('Use methodOverride');

// Middleware for route import
app.use('/import', importMiddleware);
Logger.silly('Use importMiddleware at route "/import"');

// Save to res.locals.expense current expense
app.use('/travels/:id/expenses/:id', expenseIdMiddleware);
Logger.silly('Use expenseIdMiddleware at route "/travels:id/expenses:id"');

// Save to res.locals.travels current travel
app.use('/travels/:id', travelIdMiddleware);
Logger.silly('Use travelIdMiddleware at route "/travels:id"');

// Function to check for rates at data.fixer.io and save them to DB
getRates();
Logger.silly('Function getRates initialized');

/**
 * Primary app routes.
 */
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
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
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
app.get('/import', passportConfig.isAuthenticated, importController.getImport);
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
  passport.authenticate('google', { scope: 'profile email' })
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
  }
);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(
    errorHandler({
      log: (err, str, req, res) => {
        if (
          err instanceof ImportFileError ||
          err instanceof mongoose.CastError
        ) {
          console.log(str);
        } else {
          console.log(err);
        }
      }
    })
  );
} else {
  app.use((err, req, res, next) => {
    if (err instanceof ImportFileError) {
      console.log(err.stack);
      res.status(400);
      res.redirect(req.path);
    } else if (err instanceof mongoose.CastError) {
      console.log(err.stack);
      res.status(400);
      res.redirect('/travels');
    } else {
      console.log(err);
      res.status(500).render('error', {
        layout: 'errorLayout',
        title: 'Error'
      });
    }
  });
}

async function startServer() {
  Logger.debug('Initalizing App');

  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   */
  // await require('./loaders')({ expressApp: app });

  app.listen(config.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`Server listening on port: ${config.port}`);
  });
}

startServer();
