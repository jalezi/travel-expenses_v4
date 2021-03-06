const morgan = require('morgan');
const expressHbs = require('express-hbs');
const compression = require('compression');
const sass = require('node-sass-middleware');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const formidable = require('express-formidable');
const lusca = require('lusca');
const express = require('express');
const cors = require('cors');

const LoggerClass = require('./LoggerClass');

const Logger = new LoggerClass('express');
const { mainLogger, logger } = Logger;
const LoggerHttp = new LoggerClass('http');
const { logger: httpLogger } = LoggerHttp;
mainLogger.debug('config\\express INITIALIZING!');

const config = require('.');


// Middlewares
const redirectAfterLogin = require('../utils/middleware/redirectAfterLogin');
const methodOverride = require('../utils/middleware/methodOverride');
const importMiddleware = require('../utils/middleware/importMiddleware');
const expenseIdMiddleware = require('../utils/middleware/expenseIdMiddleware');
const travelIdMiddleware = require('../utils/middleware/travelIdMiddleware');

// Routes
const routes = require('./routes');


// Morgan option
let morganOption;
switch (config.envNode) {
  case 'development':
    morganOption = 'dev';
    break;
  case 'production':
    morganOption = 'combined';
    break;
  default:
    morganOption = 'tiny';
}

/**
 * @fileoverview Runs all expres configurations.
 *
 * @module config/express
 * @author Jaka Daneu
 * @requires NPM:morgan
 * @requires NPM:expressHbs
 * @requires NPM:compression
 * @requires NPM:node-sass-middleware
 * @requires NPM:body-parser
 * @requires NPM:express-validator
 * @requires NPM:express-session
 * @requires NPM:passport
 * @requires NPM:flash
 * @requires NPM:formidable
 * @requires NPM:lusca
 * @requires NPM:express
 * @requires NPM:cors
 * @requires module:config/LoggerClass
 * @requires module:utils/middleware/redirectAfterLogin
 * @requires module:utils/middleware/methodOverride
 * @requires module:utils/middleware/importMiddleware
 * @requires module:utils/middleware/expenseMiddleware
 * @requires module:utils/middleware/travelMiddleware
 * @requires module:config/routes
 */

/**
 * Express configuration setup.
 * @async
 * @param {Express} app Express server Nodejs web framework.
 */
module.exports = async app => {
  logger.debug('Express configuration initializing');
  // Set MORGAN logger to use WINSTON stream write
  // const morganOption = config.envNode === 'development' ? 'dev' : 'combined';
  app.use(
    morgan(morganOption, {
      stream: httpLogger.stream
    })
  );
  logger.silly(`Use morgan with ${morganOption} and winston logger`);

  // Set host, port and views
  app.set('host', config.envHost);
  app.set('port', config.port);
  app.set('views', config.views);
  logger.silly(`Express host: ${app.get('host')}, port: ${app.get('port')}`);
  logger.silly(`Express views: ${app.get('views')}`);

  // Set Engine - HBS
  app.engine('hbs', expressHbs.express4(config.hbs));
  app.set('view engine', '.hbs');
  logger.silly('Express engine set as HBS!');

  // TODO Add explanation
  // Compression
  app.use(compression());
  logger.silly('Use compression');

  // Set SASS
  app.use(sass(config.sass));
  const msg = `\n   src: ${config.sass.src},\n   dest: ${config.sass.dest}`;
  logger.silly(`Sass configuration folders:${msg}`);

  // Middleware that transforms the raw string of req.body into json or urlencoded
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  logger.silly('Use body-parser json & urlencoded');

  // Set middleware expess-validator
  // works with express-validator@5.3.1 and below
  // TODO migrate to express-validator@6.2, don't forget controllers folder
  app.use(expressValidator());
  logger.silly('Use express-validator middleware');

  //  Session data is not saved in the cookie itself,
  //  just the session ID. Session data is stored server-side.
  //  Since version 1.5.0, the cookie-parser middleware no longer needs
  //  to be used for this module to work.
  //  This module now directly reads and writes cookies on req/res.
  //  Using cookie-parser may result in issues if the secret
  //  is not the same between this module and cookie-parser.
  app.use(session(config.session));
  logger.debug(`MongosStore session url === mongo connect url: ${config.session.store.options.url === config.db.uri}`);
  logger.silly('Use session middleware');

  //  Passport uses the concept of strategies to authenticate requests.
  //  Strategies can range from verifying username and password credentials,
  //  delegated authentication using OAuth (for example, via Facebook or Twitter),
  //  or federated authentication using OpenID.
  //  Before authenticating requests,
  //  the strategy (or strategies) used by an application must be configured
  app.use(passport.initialize());
  app.use(passport.session());
  logger.silly('Use passport initialize and session middleware');

  // Flash is an extension of connect-flash with the ability to define
  //  a flash message and render it without redirecting the request.
  app.use(flash());
  logger.silly('Use flash middleware');

  // Formidable - A Node.js module for parsing form data, especially file uploads.
  app.use('/import', formidable(config.formidable));
  app.use('/import', (req, res, next) => {
    if (Object.keys(req.body).length === 0 && req.fields) {
      req.body = req.fields;
    }
    next();
  });
  logger.silly(
    'Use formidable middleware & set req.body for route "/import" & set req.body'
  );

  // Lusca - Web application security middleware.
  app.use((req, res, next) => {
    lusca.csrf()(req, res, next);
  });
  app.use(lusca(config.lusca));
  logger.silly('Use lusca middleware for every response/request');

  // At a minimum, disable X-Powered-By header
  app.disable('x-powered-by');
  logger.silly('Disable "x-powered-by"');

  // Attach user to response from request
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  logger.silly('Set res.locals.user for every response/request');

  // After successful login, redirect back to the intended page
  app.use(redirectAfterLogin);
  logger.silly('Set redirection to intended page after successful login');

  const {
    pub, popper, bootstrap, jquery, webfonts
  } = config.static;
  const maxAge = 31557600000;
  const staticOptions = { maxAge };
  app.use('/', express.static(pub, staticOptions));
  app.use('/js/lib', express.static(popper, staticOptions));
  app.use('/js/lib', express.static(bootstrap, staticOptions));
  app.use('/js/lib', express.static(jquery, staticOptions));
  app.use('/webfonts', express.static(webfonts, staticOptions));
  logger.silly('Use static: public, popper, bootstrap & jquery libraries');

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');
  logger.silly('Enable trust-proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors({ origin: 'http://localhost' }));
  logger.silly('Use cors middleware');

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(methodOverride);
  logger.silly('Use methodOverride');

  // Middleware for route import
  app.use('/import', importMiddleware);
  logger.silly('Use importMiddleware at route "/import"');

  // Save to res.locals.expense current expense
  app.use('/travels/:id/expenses/:id', expenseIdMiddleware);
  logger.silly('Use expenseIdMiddleware at route "/travels:id/expenses:id"');

  // Save to res.locals.travels current travel
  app.use('/travels/:id', travelIdMiddleware);
  logger.silly('Use travelIdMiddleware at route "/travels:id"');

  // Load API routes
  routes(app);
  logger.silly('API routes loaded');
};
