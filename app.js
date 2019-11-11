/* eslint-disable no-unused-vars */
// jshint esversion: 6
/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');

const sass = require('node-sass-middleware');
const multer = require('multer');

const formidable = require('express-formidable');
const expressHbs = require('express-hbs');
const methodOverride = require('method-override');

require('./utils/hbsHelpers/hbsHelpers');
require('./utils/hbsHelpers/yearsAccordion');
require('full-icu');
const getRates = require('./utils/getRates');

const Travel = require('./models/Travel');
const Expense = require('./models/Expense');
const Rate = require('./models/Rate');
const myErrors = require('./utils/myErrors');

const { importFileError } = myErrors;

const upload = multer({ dest: path.join(__dirname, 'uploads') });


/**
  * Added by me
  * Catch uncaught errors
  */
process.on('uncaughtException', (err) => {
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
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 * added useUnifiedTopology: true 12 sep '19'
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', expressHbs.express4({
  layoutsDir: path.join(__dirname, './views/layouts'),
  partialsDir: [path.join(__dirname, './views/partials'), path.join(__dirname, './views/account'), path.join(__dirname, './views/travels')],
  defaultView: 'layout',
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator()); // works with express-validator@5.3.1
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
   * Added by my
   * express-formidable
   */
app.use('/import', formidable({
  encoding: 'utf-8',
  uploadDir: path.join(__dirname, '/uploads'),
  keepExtensions: true
}));
app.use('/import', (req, res, next) => {
  if (Object.keys(req.body).length === 0 && req.fields) {
    req.body = req.fields;
  }
  next();
});

app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user
    && req.path !== '/login'
    && req.path !== '/signup'
    && !req.path.match(/^\/auth/)
    && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user
    && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));

/**
  * Added by me
  * To overide form methodOverride
  * Must be placed after: app.use(bodyParser.urlencoded())
  */

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

/**
  * Added by me
  * Save to res.locals.travels all user travel, sorted by dateFrom ascending
  */
app.use('/import', async (req, res, next) => {
  try {
    const travels = await Travel.find({ _user: req.user._id, _id: { $in: req.user.travels } })
      .populate({
        path: 'expenses',
        populate: { path: 'curRate' }
      }).sort({ dateFrom: 1 });
    res.locals.travels = travels;
    next();
  } catch (err) {
    next(err);
  }
});

/*
 * Add by me
 * Save to res.locals.expense current expense
 */
app.use('/travels/:id/expenses/:id', async (req, res, next) => {
  if ((!res.locals.expense || res.locals.expense._id !== req.params.id) && req.params.id !== 'new') {
    try {
      const baseUrl = req.baseUrl.split('/');
      const travelId = baseUrl[2];
      const travel = await Travel.findById(travelId).populate({
        path: 'expenses',
        populate: { path: 'curRate' }
      });
      const expense = await Expense.findById(req.params.id).populate({
        path: 'curRate'
      });
      let rates = await Rate.findRatesOnDate(travel, (err, result) => {
        if (err) {
          throw err;
        }
      });

      if (rates.length === 0) {
        rates = await Rate.findRateBeforeOrAfterDate(travel, (err, result) => {
          if (err) {
            throw new Error(err);
          }
        });
      }
      res.locals.expense = expense;
      res.locals.rates = rates;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

/**
  * Added by me
  * Save to res.locals.travels current travel
  */
app.use('/travels/:id', async (req, res, next) => {
  if ((!res.locals.travel || res.locals.travel._id !== req.params.id) && req.params.id !== 'new' && req.params.id !== 'total_pdf') {
    try {
      const travel = await Travel.findById(req.params.id).populate({
        path: 'expenses',
        populate: { path: 'curRate' }
      });
      let rates = await Rate.findRatesOnDate(travel, (err, result) => {
        if (err) {
          throw err;
        }
      });

      if (rates.length === 0) {
        rates = await Rate.findRateBeforeOrAfterDate(travel, (err, result) => {
          if (err) {
            throw new Error(err);
          }
        });
      }
      res.locals.travel = travel;
      res.locals.rates = rates;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});


/**
  * Added by me
  * Create job to get rates - every day, every 1 minute of the hour
  * Get rates from fixer.io api with base: EUR and save to database.
  */
getRates();

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
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

app.get('/travels', passportConfig.isAuthenticated, travelController.getTravels);
app.get('/travels/new', passportConfig.isAuthenticated, travelController.getNewTravel);
app.post('/travels/new', passportConfig.isAuthenticated, travelController.postNewTravel);
app.get('/travels/total_pdf', passportConfig.isAuthenticated, travelController.getTravelsTotalPDF);
app.get('/travels/:id', passportConfig.isAuthenticated, travelController.getTravel);
app.delete('/travels/:id', passportConfig.isAuthenticated, travelController.deleteTravel);
app.patch('/travels/:id', passportConfig.isAuthenticated, travelController.updateTravel);
app.post('/travels/:id/expenses/new', passportConfig.isAuthenticated, expenseController.postNewExpense);
app.get('/travels/:id/expenses/:id', passportConfig.isAuthenticated, expenseController.getExpense);
app.patch('/travels/:id/expenses/:id', passportConfig.isAuthenticated, expenseController.updateExpense);
app.delete('/travels/:id/expenses/:id', passportConfig.isAuthenticated, expenseController.deleteExpense);
app.get('/import', passportConfig.isAuthenticated, importController.getImport);
app.post('/import', passportConfig.isAuthenticated, importController.postImport);
app.get('/travels/:id/pdf', passportConfig.isAuthenticated, travelController.getTravelExpensesPDF);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler({
    log: (err, str, req, res) => {
      if (err instanceof importFileError || err instanceof mongoose.CastError) {
        console.log(str);
      } else {
        console.log(err);
      }
    }
  }));
} else {
  app.use((err, req, res, next) => {
    if (err instanceof importFileError) {
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

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
