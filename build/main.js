/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "public/js/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable no-unused-vars */
// jshint esversion: 6

/**
 * Module dependencies.
 */
var express = __webpack_require__(/*! express */ "express");

var compression = __webpack_require__(/*! compression */ "compression");

var session = __webpack_require__(/*! express-session */ "express-session");

var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");

var logger = __webpack_require__(/*! morgan */ "morgan");

var chalk = __webpack_require__(/*! chalk */ "chalk");

var errorHandler = __webpack_require__(/*! errorhandler */ "errorhandler");

var lusca = __webpack_require__(/*! lusca */ "lusca");

var dotenv = __webpack_require__(/*! dotenv */ "dotenv");

var MongoStore = __webpack_require__(/*! connect-mongo */ "connect-mongo")(session);

var flash = __webpack_require__(/*! express-flash */ "express-flash");

var path = __webpack_require__(/*! path */ "path");

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var passport = __webpack_require__(/*! passport */ "passport");

var expressValidator = __webpack_require__(/*! express-validator */ "express-validator");

var sass = __webpack_require__(/*! node-sass-middleware */ "node-sass-middleware");

var multer = __webpack_require__(/*! multer */ "multer");

var formidable = __webpack_require__(/*! express-formidable */ "express-formidable");

var expressHbs = __webpack_require__(/*! express-hbs */ "express-hbs");

var methodOverride = __webpack_require__(/*! method-override */ "method-override");

__webpack_require__(/*! ./utils/hbsHelpers/hbsHelpers */ "./utils/hbsHelpers/hbsHelpers.js");

__webpack_require__(/*! ./utils/hbsHelpers/yearsAccordion */ "./utils/hbsHelpers/yearsAccordion.js");

__webpack_require__(/*! full-icu */ "full-icu");

var getRates = __webpack_require__(/*! ./utils/getRates */ "./utils/getRates.js");

var Travel = __webpack_require__(/*! ./models/Travel */ "./models/Travel.js");

var Expense = __webpack_require__(/*! ./models/Expense */ "./models/Expense.js");

var Rate = __webpack_require__(/*! ./models/Rate */ "./models/Rate.js");

var myErrors = __webpack_require__(/*! ./utils/myErrors */ "./utils/myErrors.js");

var importFileError = myErrors.importFileError;
var upload = multer({
  dest: path.join(__dirname, 'uploads')
});
/**
  * Added by me
  * Catch uncaught errors
  */

process.on('uncaughtException', function (err) {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node docs)
});
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

dotenv.config({
  path: '.env'
});
/**
 * Controllers (route handlers).
 */

var homeController = __webpack_require__(/*! ./controllers/home */ "./controllers/home.js");

var userController = __webpack_require__(/*! ./controllers/user */ "./controllers/user.js");

var contactController = __webpack_require__(/*! ./controllers/contact */ "./controllers/contact.js");

var travelController = __webpack_require__(/*! ./controllers/travel */ "./controllers/travel.js");

var expenseController = __webpack_require__(/*! ./controllers/expense */ "./controllers/expense.js");

var importController = __webpack_require__(/*! ./controllers/import */ "./controllers/import.js");
/**
 * API keys and Passport configuration.
 */


var passportConfig = __webpack_require__(/*! ./config/passport */ "./config/passport.js");
/**
 * Create Express server.
 */


var app = express();
/**
 * Connect to MongoDB.
 * added useUnifiedTopology: true 12 sep '19'
 */

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', function (err) {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
/**
 * Express configuration.
 */

app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, './views'));
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
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator()); // works with express-validator@5.3.1

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1209600000
  },
  // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
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
app.use('/import', function (req, res, next) {
  if (Object.keys(req.body).length === 0 && req.fields) {
    req.body = req.fields;
  }

  next();
});
app.use(function (req, res, next) {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function (req, res, next) {
  // After successful login, redirect back to the intended page
  if (!req.user && req.path !== '/login' && req.path !== '/signup' && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }

  next();
});
app.use('/', express["static"](path.join(__dirname, 'public'), {
  maxAge: 31557600000
}));
app.use('/js/lib', express["static"](path.join(__dirname, 'node_modules/popper.js/dist/umd'), {
  maxAge: 31557600000
}));
app.use('/js/lib', express["static"](path.join(__dirname, 'node_modules/bootstrap/dist/js'), {
  maxAge: 31557600000
}));
app.use('/js/lib', express["static"](path.join(__dirname, 'node_modules/jquery/dist'), {
  maxAge: 31557600000
}));
app.use('/webfonts', express["static"](path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), {
  maxAge: 31557600000
}));
/**
  * Added by me
  * To overide form methodOverride
  * Must be placed after: app.use(bodyParser.urlencoded())
  */

app.use(methodOverride(function (req, res) {
  if (req.body && _typeof(req.body) === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
/**
  * Added by me
  * Save to res.locals.travels all user travel, sorted by dateFrom ascending
  */

app.use('/import', function _callee(req, res, next) {
  var travels;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Travel.find({
            _user: req.user._id,
            _id: {
              $in: req.user.travels
            }
          }).populate({
            path: 'expenses',
            populate: {
              path: 'curRate'
            }
          }).sort({
            dateFrom: 1
          }));

        case 3:
          travels = _context.sent;
          res.locals.travels = travels;
          next();
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          next(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
/*
 * Add by me
 * Save to res.locals.expense current expense
 */

app.use('/travels/:id/expenses/:id', function _callee2(req, res, next) {
  var baseUrl, travelId, travel, expense, rates;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!((!res.locals.expense || res.locals.expense._id !== req.params.id) && req.params.id !== 'new')) {
            _context2.next = 27;
            break;
          }

          _context2.prev = 1;
          baseUrl = req.baseUrl.split('/');
          travelId = baseUrl[2];
          _context2.next = 6;
          return regeneratorRuntime.awrap(Travel.findById(travelId).populate({
            path: 'expenses',
            populate: {
              path: 'curRate'
            }
          }));

        case 6:
          travel = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(Expense.findById(req.params.id).populate({
            path: 'curRate'
          }));

        case 9:
          expense = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(Rate.findRatesOnDate(travel, function (err, result) {
            if (err) {
              throw err;
            }
          }));

        case 12:
          rates = _context2.sent;

          if (!(rates.length === 0)) {
            _context2.next = 17;
            break;
          }

          _context2.next = 16;
          return regeneratorRuntime.awrap(Rate.findRateBeforeOrAfterDate(travel, function (err, result) {
            if (err) {
              throw new Error(err);
            }
          }));

        case 16:
          rates = _context2.sent;

        case 17:
          res.locals.expense = expense;
          res.locals.rates = rates;
          next();
          _context2.next = 25;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](1);
          next(_context2.t0);

        case 25:
          _context2.next = 28;
          break;

        case 27:
          next();

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 22]]);
});
/**
  * Added by me
  * Save to res.locals.travels current travel
  */

app.use('/travels/:id', function _callee3(req, res, next) {
  var travel, rates;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!((!res.locals.travel || res.locals.travel._id !== req.params.id) && req.params.id !== 'new' && req.params.id !== 'total_pdf')) {
            _context3.next = 22;
            break;
          }

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Travel.findById(req.params.id).populate({
            path: 'expenses',
            populate: {
              path: 'curRate'
            }
          }));

        case 4:
          travel = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(Rate.findRatesOnDate(travel, function (err, result) {
            if (err) {
              throw err;
            }
          }));

        case 7:
          rates = _context3.sent;

          if (!(rates.length === 0)) {
            _context3.next = 12;
            break;
          }

          _context3.next = 11;
          return regeneratorRuntime.awrap(Rate.findRateBeforeOrAfterDate(travel, function (err, result) {
            if (err) {
              throw new Error(err);
            }
          }));

        case 11:
          rates = _context3.sent;

        case 12:
          res.locals.travel = travel;
          res.locals.rates = rates;
          next();
          _context3.next = 20;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](1);
          next(_context3.t0);

        case 20:
          _context3.next = 23;
          break;

        case 22:
          next();

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 17]]);
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
app["delete"]('/travels/:id', passportConfig.isAuthenticated, travelController.deleteTravel);
app.patch('/travels/:id', passportConfig.isAuthenticated, travelController.updateTravel);
app.post('/travels/:id/expenses/new', passportConfig.isAuthenticated, expenseController.postNewExpense);
app.get('/travels/:id/expenses/:id', passportConfig.isAuthenticated, expenseController.getExpense);
app.patch('/travels/:id/expenses/:id', passportConfig.isAuthenticated, expenseController.updateExpense);
app["delete"]('/travels/:id/expenses/:id', passportConfig.isAuthenticated, expenseController.deleteExpense);
app.get('/import', passportConfig.isAuthenticated, importController.getImport);
app.post('/import', passportConfig.isAuthenticated, importController.postImport);
app.get('/travels/:id/pdf', passportConfig.isAuthenticated, travelController.getTravelExpensesPDF);
/**
 * OAuth authentication routes. (Sign in)
 */

app.get('/auth/google', passport.authenticate('google', {
  scope: 'profile email'
}));
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), function (req, res) {
  res.redirect(req.session.returnTo || '/');
});
/**
 * Error Handler.
 */

if (true) {
  // only use in development
  app.use(errorHandler({
    log: function log(err, str, req, res) {
      if (err instanceof importFileError || err instanceof mongoose.CastError) {
        console.log(str);
      } else {
        console.log(err);
      }
    }
  }));
} else {}
/**
 * Start Express server.
 */


app.listen(app.get('port'), function () {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});
module.exports = app;
/* WEBPACK VAR INJECTION */}.call(this, ""))

/***/ }),

/***/ "./config/passport.js":
/*!****************************!*\
  !*** ./config/passport.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var passport = __webpack_require__(/*! passport */ "passport");

var request = __webpack_require__(/*! request */ "request");

var _require = __webpack_require__(/*! passport-local */ "passport-local"),
    LocalStrategy = _require.Strategy;

var _require2 = __webpack_require__(/*! passport-google-oauth */ "passport-google-oauth"),
    GoogleStrategy = _require2.OAuth2Strategy;

var _require3 = __webpack_require__(/*! passport-oauth */ "passport-oauth"),
    OAuthStrategy = _require3.OAuthStrategy;

var _require4 = __webpack_require__(/*! passport-oauth */ "passport-oauth"),
    OAuth2Strategy = _require4.OAuth2Strategy;

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");
/**
 * Determines which data of the user object should be stored in the session.
 * The result of the serializeUser method is attached to the session as req.session.passport.user = {}.
 * In this case req.session.passport.user = {id: user.id)
 */


passport.serializeUser(function (user, done) {
  done(null, user.id);
});
/**
 * The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see 1.).
 * So your whole object is retrieved with help of that key.
 * That key here is the user id (key can be any key of the user object i.e. name,email etc).
 * In deserializeUser that key is matched with the in memory array / database or any data resource.
 *
 * The fetched object is attached to the request object as req.user
 */

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
/**
 * Sign in using Email and Password.
 */

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  User.findOne({
    email: email.toLowerCase()
  }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        msg: "Email ".concat(email, " not found.")
      });
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }

      if (isMatch) {
        return done(null, user);
      }

      return done(null, false, {
        msg: 'Invalid email or password.'
      });
    });
  });
}));
/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Google.
 */

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({
      google: profile.id
    }, function (err, existingUser) {
      if (err) {
        return done(err);
      }

      if (existingUser) {
        req.flash('errors', {
          msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
        });
        done(err);
      } else {
        User.findById(req.user.id, function (err, user) {
          if (err) {
            return done(err);
          }

          user.google = profile.id;
          user.tokens.push({
            kind: 'google',
            accessToken: accessToken
          });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.fName = user.profile.fName || profile.name.givenName;
          user.profile.lName = user.profile.lName || profile.name.familyName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.image.url;
          user.save(function (err) {
            req.flash('info', {
              msg: 'Google account has been linked.'
            });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({
      google: profile.id
    }, function (err, existingUser) {
      if (err) {
        return done(err);
      }

      if (existingUser) {
        return done(null, existingUser);
      }

      User.findOne({
        email: profile.emails[0].value
      }, function (err, existingEmailUser) {
        if (err) {
          return done(err);
        }

        if (existingEmailUser) {
          req.flash('errors', {
            msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.'
          });
          done(err);
        } else {
          var user = new User();
          user.email = profile.emails[0].value;
          user.google = profile.id;
          user.tokens.push({
            kind: 'google',
            accessToken: accessToken
          });
          user.profile.name = profile.displayName;
          user.profile.fName = profile.name.givenName;
          user.profile.lName = profile.name.familyName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = profile._json.image.url;
          user.save(function (err) {
            done(err, user);
          });
        }
      });
    });
  }
}));
/**
 * Login Required middleware.
 */

exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};
/**
 * Authorization Required middleware.
 */


exports.isAuthorized = function (req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  var token = req.user.tokens.find(function (token) {
    return token.kind === provider;
  });

  if (token) {
    next();
  } else {
    res.redirect("/auth/".concat(provider));
  }
};

/***/ }),

/***/ "./controllers/contact.js":
/*!********************************!*\
  !*** ./controllers/contact.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// jshint esversion: 8
var nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");

var mailjet = __webpack_require__(/*! node-mailjet */ "node-mailjet").connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE); // TODO implement contact form

/**
 * GET /contact
 * Contact form page.
 */


exports.getContact = function (req, res) {
  var unknownUser = !req.user;
  res.render('contact', {
    title: 'Contact',
    unknownUser: unknownUser
  });
};
/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */


exports.postContact = function (req, res, next) {
  var fromName;
  var fromEmail;

  if (!req.user) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
  }

  req.assert('message', 'Message cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  if (!req.user) {
    fromName = req.body.name;
    fromEmail = req.body.email;
  } else {
    fromName = req.user.profile.name || '';
    fromEmail = req.user.email;
  }

  var sendContactForm = function sendContactForm() {
    var sendEmail, emailData;
    return regeneratorRuntime.async(function sendContactForm$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sendEmail = mailjet.post('send', {
              version: 'v3.1'
            });
            emailData = {
              "Messages": [{
                "From": {
                  "Email": "jaka.daneu@siol.net",
                  "Name": "".concat(fromName, " - ").concat(fromEmail)
                },
                "To": [{
                  "Email": "jakad@me.com",
                  "Name": 'TExpenses App'
                }],
                'Subject': 'Contact TExpenses App',
                'TextPart': req.body.message
              }]
            };
            _context.prev = 2;
            _context.next = 5;
            return regeneratorRuntime.awrap(sendEmail.request(emailData));

          case 5:
            return _context.abrupt("return", req.flash('info', {
              msg: "An e-mail has been sent to TExpenses App."
            }));

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);
            req.flash('errors', {
              msg: 'Error sending the contact message. Please try again shortly.'
            });
            return _context.abrupt("return", _context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 8]]);
  };

  sendContactForm().then(function () {
    res.redirect('/');
  })["catch"](next);
};

/***/ }),

/***/ "./controllers/expense.js":
/*!********************************!*\
  !*** ./controllers/expense.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _ = __webpack_require__(/*! lodash */ "lodash");

var moment = __webpack_require__(/*! moment */ "moment");

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");

var Travel = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js");

var Expense = __webpack_require__(/*! ../models/Expense */ "./models/Expense.js");

var Currency = __webpack_require__(/*! ../models/Currency */ "./models/Currency.js");

var ObjectId = mongoose.Types.ObjectId;

var _require = __webpack_require__(/*! ../lib/globals */ "./lib/globals.js"),
    expenseTypes = _require.expenseTypes;

var constants = __webpack_require__(/*! ../lib/constants */ "./lib/constants.js");
/*
 * GET /travels/:id/expenses/:id
 */


exports.getExpense = function (req, res, next) {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return next(new Error('Not valid Object Id'));
  }

  var mileageType;
  var expense = res.locals.expense;
  var travel = res.locals.travel;
  var tDateFrom = travel.dateFrom;
  var tDateTo = travel.dateTo;

  if (expense.type != 'Mileage') {
    var rate = Object.values(expense.curRate.rate)[0];
    expense.rate = rate.toFixed(2);
    mileageType = false;
  } else {
    expense.rate = travel.perMileAmount;
    mileageType = true;
  }

  res.render('expenses/expense', {
    title: 'Expense',
    travel: travel,
    expense: expense,
    mileageType: mileageType,
    tDateFrom: tDateFrom,
    tDateTo: tDateTo,
    constants: constants,
    rates: JSON.stringify(res.locals.rates),
    expenseCurRate: JSON.stringify(expense.curRate),
    expenseTypes: expenseTypes
  });
};
/*
 * DELETE /travels/:id/expenses/:id
 */


exports.deleteExpense = function _callee(req, res, next) {
  var expenseId, travel, expense, splitUrl;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          expenseId = req.params.id;
          travel = res.locals.travel;
          expense = res.locals.expense;
          splitUrl = req.url.split('/');
          Expense.findOneAndDelete({
            _id: expenseId,
            travel: travel._id
          }).then(function (result) {
            Travel.findByIdAndUpdate(travel._id, {
              $pullAll: {
                'expenses': [expenseId]
              },
              $inc: {
                "total": -expense.amountConverted
              }
            }, function (err, travel) {
              if (!err) {
                return next(err);
              }
            });
          }).then(function () {
            req.flash('info', {
              msg: "Expense successfully deleted!!"
            });
            res.redirect("/travels/".concat(travel._id));
          })["catch"](function (err) {
            next(err);
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};
/*
 * PATCH /travels/:id/expenses/:id
 */


exports.updateExpense = function _callee3(req, res, next) {
  var travel, expense, currencyOptions, decimalOptions, dateCompare, errors, body, invoiceDate, invoiceCurrency, invDate, rate, cur, curRate;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          travel = res.locals.travel;
          expense = res.locals.expense;
          currencyOptions = {
            allow_negatives: false,
            allow_negative_sign_placeholder: true,
            thousands_separator: ',',
            decimal_separator: '.',
            allow_decimal: true,
            require_decimal: false,
            digits_after_decimal: [2],
            allow_space_after_digits: false
          };
          decimalOptions = {
            decimal_digits: 2
          };
          req.assert('expenseDescription', 'Description is empty or to long (max 60 characters)!').isLength({
            min: 1,
            max: 60
          });
          dateCompare = moment(res.locals.travel.dateFrom).add(-1, 'days').format('YYYY-MM-DD');
          req.assert('invoiceDate', 'Invoice date should be within travel dates').isAfter(dateCompare);
          dateCompare = moment(res.locals.travel.dateTo).add(1, 'days').format('YYYY-MM-DD');
          req.assert('invoiceDate', 'Invoice date should be within travel dates').isBefore(dateCompare);

          if (req.body.expenseType === 'Mileage') {
            req.assert('travelPerMileAmount', 'Per mile amount should be positive number with 2 decimals!').isDecimal(decimalOptions);
            req.assert('invoiceUnit', 'Must be "km" or "mi"').custom(function () {
              return 'km' === req.body.invoiceUnit || 'mi' === req.body.invoiceUnit;
            });
            req.assert('amountDistance', 'Number with 2 decimals').isDecimal(decimalOptions);
            req.assert('amountDistance2', 'Number with 2 decimals').isDecimal(decimalOptions);
            req.assert('amountConverted2', 'Number with 2 decimals').isDecimal(decimalOptions);
          } else {
            req.assert('invoiceCurrency', 'Currency name must be 3 charachters long').isLength({
              min: 3,
              max: 3
            });
            req.assert('rate', 'Currency rate with 2 decimals').isNumeric().isCurrency(currencyOptions);
            req.assert('amount', 'Number with 2 decimals').isDecimal(decimalOptions);
            req.assert('amountConverted', 'Number with 2 decimals').isDecimal(decimalOptions);
          }

          errors = req.validationErrors();

          if (!errors) {
            _context3.next = 14;
            break;
          }

          req.flash('errors', errors);
          return _context3.abrupt("return", res.redirect("/travels/".concat(travel._id)));

        case 14:
          body = _.pick(req.body, ['expenseType', 'expenseDescription', 'invoiceDate', 'amountDistance', 'amountDistance2', 'amountConverted', 'amountConverted2', 'invoiceCurrency', 'rate', 'amount']);
          invoiceDate = new Date(req.body.invoiceDate);
          travel.total = (travel.total - Number(expense.amountConverted) + Number(body.amountConverted) + Number(body.amountConverted2)).toFixed(2); // Different data if expense type is Mileage

          if (!(req.body.expenseType != 'Mileage')) {
            _context3.next = 36;
            break;
          }

          invoiceCurrency = req.body.invoiceCurrency.toUpperCase();
          invDate = moment(invoiceDate).format('YYYY-MM-DD');
          rate = req.body.rate;
          cur = {};
          cur[invoiceCurrency] = Number(rate);
          curRate = {};
          _context3.next = 26;
          return regeneratorRuntime.awrap(Currency.find({
            base: res.locals.travel.homeCurrency,
            date: invoiceDate,
            rate: cur
          }, function _callee2(err, item) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(item.length === 1)) {
                      _context2.next = 4;
                      break;
                    }

                    curRate = item[0];
                    _context2.next = 7;
                    break;

                  case 4:
                    curRate = new Currency({
                      base: res.locals.travel.homeCurrency,
                      date: invoiceDate,
                      rate: cur
                    });
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(curRate.save().then(function (doc) {})["catch"](function (err) {
                      next(err);
                    }));

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }));

        case 26:
          expense.type = body.expenseType;
          expense.description = body.expenseDescription;
          expense.date = invoiceDate;
          expense.currency = body.invoiceCurrency.toUpperCase();
          expense.curRate = curRate;
          expense.amount = body.amount;
          expense.amountConverted = body.amountConverted;
          expense.unit = undefined;
          _context3.next = 44;
          break;

        case 36:
          expense.type = body.expenseType;
          expense.description = body.expenseDescription;
          expense.date = invoiceDate;
          expense.unit = req.user.homeDistance;
          expense.amount = body.amountDistance;
          expense.amountConverted = body.amountConverted2;
          expense.currency = undefined;
          expense.curRate = undefined;

        case 44:
          _context3.next = 46;
          return regeneratorRuntime.awrap(expense.save().then(function (doc) {
            travel.save().then(function () {
              req.flash('info', {
                msg: 'Expense successfully updated!'
              });
              res.redirect("/travels/".concat(travel._id));
            })["catch"](function (err) {
              next(err);
            });
          })["catch"](function (err) {
            next(err);
          }));

        case 46:
        case "end":
          return _context3.stop();
      }
    }
  });
};
/*
 * POST /travels/:id/expenses/new
 */


exports.postNewExpense = function _callee5(req, res, next) {
  var currencyOptions, decimalOptions, dateCompare, errors, expense, invoiceDate, invoiceCurrency, invDate, _invoiceCurrency, _invDate, rate, cur, curRate, doc, travel, result, _result;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          currencyOptions = {
            allow_negatives: false,
            allow_negative_sign_placeholder: true,
            thousands_separator: ',',
            decimal_separator: '.',
            allow_decimal: true,
            require_decimal: false,
            digits_after_decimal: [2],
            allow_space_after_digits: false
          };
          decimalOptions = {
            decimal_digits: 2
          };
          req.assert('expenseDescription', 'Description is empty or to long (max 60 characters)!').isLength({
            min: 1,
            max: 60
          });
          dateCompare = moment(res.locals.travel.dateFrom).add(-1, 'days').format('YYYY-MM-DD');
          req.assert('invoiceDate', 'Invoice date should be within travel dates').isAfter(dateCompare);
          dateCompare = moment(res.locals.travel.dateTo).add(1, 'days').format('YYYY-MM-DD');
          req.assert('invoiceDate', 'Invoice date should be within travel dates').isBefore(dateCompare);

          if (req.body.expenseType === 'Mileage') {
            req.assert('travelPerMileAmount', 'Per mile amount should be positive number with 2 decimals!').isDecimal(decimalOptions);
            req.assert('invoiceUnit', 'Must be "km" or "mi"').custom(function () {
              return 'km' === req.body.invoiceUnit || 'mi' === req.body.invoiceUnit;
            });
            req.assert('amountDistance', 'Number with 2 decimals').isDecimal(decimalOptions);
            req.assert('amountDistance2', 'Number with 2 decimals').isDecimal(decimalOptions);
            req.assert('amountConverted2', 'Number with 2 decimals').isDecimal(decimalOptions);
          } else {
            req.assert('invoiceCurrency', 'Currency name must be 3 charachters long').isLength({
              min: 3,
              max: 3
            });
            req.assert('rate', 'Currency rate with 2 decimals').isNumeric().isCurrency(currencyOptions);
            req.assert('amount', 'Number with 2 decimals').isDecimal(decimalOptions);
            req.assert('amountConverted', 'Number with 2 decimals').isDecimal(decimalOptions);
          }

          errors = req.validationErrors();

          if (!errors) {
            _context5.next = 12;
            break;
          }

          req.flash('errors', errors);
          return _context5.abrupt("return", res.redirect("/travels/".concat(req.params.id)));

        case 12:
          expense = {};
          invoiceDate = new Date(req.body.invoiceDate);
          invoiceCurrency = req.body.invoiceCurrency.toUpperCase();
          invDate = moment(invoiceDate).format('YYYY-MM-DD'); // Different data if expense type is Mileage

          if (!(req.body.expenseType != 'Mileage')) {
            _context5.next = 28;
            break;
          }

          _invoiceCurrency = req.body.invoiceCurrency.toUpperCase();
          _invDate = moment(invoiceDate).format('YYYY-MM-DD');
          rate = req.body.rate;
          cur = {};
          cur[_invoiceCurrency] = Number(rate);
          curRate = {};
          _context5.next = 25;
          return regeneratorRuntime.awrap(Currency.find({
            base: res.locals.travel.homeCurrency,
            date: invoiceDate,
            rate: cur
          }, function _callee4(err, item) {
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!(item.length === 1)) {
                      _context4.next = 4;
                      break;
                    }

                    curRate = item[0];
                    _context4.next = 7;
                    break;

                  case 4:
                    curRate = new Currency({
                      base: res.locals.travel.homeCurrency,
                      date: invoiceDate,
                      rate: cur
                    });
                    _context4.next = 7;
                    return regeneratorRuntime.awrap(curRate.save());

                  case 7:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          }));

        case 25:
          expense = new Expense({
            travel: req.params.id,
            type: req.body.expenseType,
            description: req.body.expenseDescription,
            date: invoiceDate,
            currency: req.body.invoiceCurrency.toUpperCase(),
            curRate: curRate,
            amount: req.body.amount,
            amountConverted: req.body.amountConverted,
            _user: req.user._id
          });
          _context5.next = 29;
          break;

        case 28:
          expense = new Expense({
            travel: req.params.id,
            type: req.body.expenseType,
            description: req.body.expenseDescription,
            date: invoiceDate,
            unit: req.user.homeDistance,
            amount: req.body.amountDistance,
            amountConverted: req.body.amountConverted2,
            _user: req.user._id
          });

        case 29:
          _context5.prev = 29;
          _context5.next = 32;
          return regeneratorRuntime.awrap(expense.save());

        case 32:
          doc = _context5.sent;
          _context5.next = 35;
          return regeneratorRuntime.awrap(Travel.findByIdAndUpdate(res.locals.travel._id, {
            $addToSet: {
              'expenses': doc._id
            }
          }, function (err, travel) {
            if (err) {
              return next(err);
            }
          }));

        case 35:
          travel = _context5.sent;

          // TODO refactor if statement. No need for if statement.
          if (doc.type != 'Mileage') {
            result = Number(travel.total) + Number(doc.amountConverted);
            travel.total = result.toFixed(2);
            travel.save();
          } else {
            _result = Number(travel.total) + Number(doc.amountConverted);
            travel.total = _result.toFixed(2);
            travel.save();
          }

          _context5.next = 42;
          break;

        case 39:
          _context5.prev = 39;
          _context5.t0 = _context5["catch"](29);
          return _context5.abrupt("return", next(_context5.t0));

        case 42:
          req.flash('success', {
            msg: 'Successfully added new expense!'
          });
          res.redirect("/travels/".concat(req.params.id));

        case 44:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[29, 39]]);
};

/***/ }),

/***/ "./controllers/home.js":
/*!*****************************!*\
  !*** ./controllers/home.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var moment = __webpack_require__(/*! moment */ "moment");

var Travel = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js");

var constants = __webpack_require__(/*! ../lib/constants */ "./lib/constants.js");
/**
 * GET /
 * Home page.
 */


exports.index = function (req, res, next) {
  if (!req.user) {
    res.render('home', {
      title: 'Home'
    });
  } else {
    Travel.byYear_byMonth(req.user).then(function (docs) {
      res.render('home', {
        title: 'Home',
        docs: docs,
        constants: constants
      });
    })["catch"](function (err) {
      next(err);
    });
  }
};

/***/ }),

/***/ "./controllers/import.js":
/*!*******************************!*\
  !*** ./controllers/import.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _ = __webpack_require__(/*! lodash */ "lodash");

var moment = __webpack_require__(/*! moment */ "moment");

var fs = __webpack_require__(/*! fs */ "fs");

var Papa = __webpack_require__(/*! papaparse */ "papaparse");

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");

var Travel = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js");

var Expense = __webpack_require__(/*! ../models/Expense */ "./models/Expense.js");

var Rate = __webpack_require__(/*! ../models/Rate */ "./models/Rate.js");

var Currency = __webpack_require__(/*! ../models/Currency */ "./models/Currency.js");

var ObjectId = mongoose.Types.ObjectId;

var _require = __webpack_require__(/*! ../lib/globals */ "./lib/globals.js"),
    expenseTypes = _require.expenseTypes;

var constants = __webpack_require__(/*! ../lib/constants */ "./lib/constants.js");

var postImport = __webpack_require__(/*! ../utils/postImport */ "./utils/postImport.js");

var myErrors = __webpack_require__(/*! ../utils/myErrors */ "./utils/myErrors.js");
/*
 * GET /import
 * Page with import form.
 * You can chooses between travels or expenses import.
 * TODO Change form. At the moment expenses import is only for multiple expenses.
 */


exports.getImport = function _callee(req, res, next) {
  var travels;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          travels = res.locals.travels;
          res.render('travels/import', {
            title: 'Import',
            travels: travels
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};
/*
 * POST /import
 * Import travels or expenses from CSV files.
 */


exports.postImport = function _callee3(req, res, next) {
  var message, myFile, myFilePath, combinedCurrencies, dataArray, getCurrenciesArray, currenciesArray, _error, newCurrencies, insertedCurrencies;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          message = '';
          myFile = req.files.myFile;
          myFilePath = req.files.myFile.path;
          combinedCurrencies = [];
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(postImport.readCheckFileAndGetData(myFile, req.body.option)["catch"](function (err) {
            throw err;
          }));

        case 7:
          dataArray = _context3.sent;

          if (!(dataArray instanceof Error)) {
            _context3.next = 10;
            break;
          }

          throw dataArray;

        case 10:
          if (!(req.body.option === 'travels')) {
            _context3.next = 20;
            break;
          }

          _context3.next = 13;
          return regeneratorRuntime.awrap(postImport.travelImport(dataArray, req.user._id));

        case 13:
          message = _context3.sent;

          if (!message.error) {
            _context3.next = 18;
            break;
          }

          error = message.error;
          message = message.msg;
          throw error;

        case 18:
          _context3.next = 42;
          break;

        case 20:
          _context3.next = 22;
          return regeneratorRuntime.awrap(postImport.expensesImportSetCurrencyArray(dataArray, req.user._id, res.locals.travels));

        case 22:
          getCurrenciesArray = _context3.sent;
          currenciesArray = getCurrenciesArray.currenciesArray;
          message = getCurrenciesArray.message;
          _error = getCurrenciesArray.err;

          if (!_error) {
            _context3.next = 28;
            break;
          }

          throw _error;

        case 28:
          _context3.next = 30;
          return regeneratorRuntime.awrap(postImport.expensesImportNewCurrenciesForSave(currenciesArray)["catch"](function (err) {
            throw err;
          }));

        case 30:
          newCurrencies = _context3.sent;
          _context3.next = 33;
          return regeneratorRuntime.awrap(Currency.insertMany(newCurrencies.notExistingCurrenciesDB));

        case 33:
          insertedCurrencies = _context3.sent;
          combinedCurrencies = insertedCurrencies.concat(newCurrencies.existingCurrenciesDB); // loop trough imported data

          _context3.next = 37;
          return regeneratorRuntime.awrap(_.forEach(dataArray, function _callee2(value, key, object) {
            var currency;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    delete value.travelName; // find currency for expense

                    _context2.next = 3;
                    return regeneratorRuntime.awrap(combinedCurrencies.sort(function (a, b) {
                      return a.date - b.date;
                    }).find(function (item) {
                      var dateEqual = value.date === moment(item.date).format('YYYY-MM-DD');
                      var currencyMatch = item.rate.hasOwnProperty(value.currency);
                      var notMileage = value.type != 'Mileage';
                      var result = dateEqual && currencyMatch && notMileage;
                      return result;
                    }));

                  case 3:
                    currency = _context2.sent;

                    // set currency id for expense if currency exist in DB
                    if (currency) {
                      value.curRate = currency._id;
                    }

                  case 5:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }));

        case 37:
          if (!(dataArray.length === 0)) {
            _context3.next = 39;
            break;
          }

          throw new myErrors.importFileError('Nothing to import! File has wrong data!');

        case 39:
          _context3.next = 41;
          return regeneratorRuntime.awrap(postImport.expenseImport(dataArray)["catch"](function (err) {
            throw err;
          }));

        case 41:
          message = _context3.sent;

        case 42:
          if (!message.error) {
            _context3.next = 46;
            break;
          }

          error = message.error;
          message = message.msg;
          throw error;

        case 46:
          postImport.deleteFile(myFilePath, 'File deleted after processed!');
          req.flash('success', {
            msg: message
          });
          res.redirect('/travels');
          _context3.next = 55;
          break;

        case 51:
          _context3.prev = 51;
          _context3.t0 = _context3["catch"](4);
          postImport.deleteFile(myFilePath, 'File deleted after error!');

          if (!_context3.t0 instanceof myErrors.importFileError) {
            message = 'Something went wrong. Check console log!';
            next(_context3.t0);
          } else {
            res.status(400);
            message = _context3.t0.message;
            req.flash('errors', {
              msg: message
            });
            res.redirect('/import');
          }

        case 55:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 51]]);
};

/***/ }),

/***/ "./controllers/travel.js":
/*!*******************************!*\
  !*** ./controllers/travel.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _ = __webpack_require__(/*! lodash */ "lodash");

var moment = __webpack_require__(/*! moment */ "moment");

var fs = __webpack_require__(/*! fs */ "fs");

var Papa = __webpack_require__(/*! papaparse */ "papaparse");

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");

var Travel = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js");

var Expense = __webpack_require__(/*! ../models/Expense */ "./models/Expense.js");

var Rate = __webpack_require__(/*! ../models/Rate */ "./models/Rate.js");

var ObjectId = mongoose.Types.ObjectId;

var _require = __webpack_require__(/*! ../lib/globals */ "./lib/globals.js"),
    expenseTypes = _require.expenseTypes;

var constants = __webpack_require__(/*! ../lib/constants */ "./lib/constants.js");

var updateExpensesToMatchTravelRangeDates = __webpack_require__(/*! ../utils/updateExpensesToMatchTravelRangeDates */ "./utils/updateExpensesToMatchTravelRangeDates.js");

var travelExpensesToPDF = __webpack_require__(/*! ../utils/travelExpensesToPDF */ "./utils/travelExpensesToPDF.js");

var travelsTotalToPDF = __webpack_require__(/*! ../utils/travelsTotalToPDF */ "./utils/travelsTotalToPDF.js");
/*
 * GET /travels/total_pdf
 * Create, open in new tab and save PDF file for filtered travels
 */


exports.getTravelsTotalPDF = function _callee(req, res, next) {
  var createTravelsTotalPDF, travels, queryDateFrom, queryDateTo, totalSum, df, dt, dateRange, indexes, travelIndexesArray, travelIndexes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          createTravelsTotalPDF = function _ref(res, travels, user, dateRange, sum, indexes) {
            var stream = travelsTotalToPDF(travels, user, dateRange, sum, indexes);
            var filename = "TOTAL_".concat(user._id, "_").concat(df, "_").concat(dt, ".pdf"); // Be careful of special characters

            filename = encodeURIComponent(filename); // Ideally this should strip them

            res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res);
          };

          // Get date range from url query
          df = req.query.df;
          dt = req.query.dt;
          dateRange = {
            df: df,
            dt: dt
          };
          indexes = [];
          _context.next = 7;
          return regeneratorRuntime.awrap(User.aggregate([{
            '$project': {
              'travels': 1
            }
          }, {
            '$match': {
              '_id': req.user._id
            }
          }], function (err, docs) {// console.log(docs);
          }));

        case 7:
          travelIndexesArray = _context.sent;
          travelIndexes = travelIndexesArray[0].travels; // if statement is safety in case date range is not passed as url query

          if (!(df === '' || dt === '')) {
            _context.next = 16;
            break;
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(Travel.find({
            _user: res.locals.user._id
          }));

        case 12:
          travels = _context.sent;
          totalSum = Travel.aggregate([{
            '$match': {
              '_user': res.locals.user._id
            }
          }, {
            '$group': {
              '_id': null,
              'sum': {
                '$sum': '$total'
              }
            }
          }], function (err, result) {
            if (err) {
              next(err);
            } else {
              var sum;

              if (result.length === 0) {
                sum = 0;
              } else {
                sum = Number(result[0].sum);
              }

              createTravelsTotalPDF(res, travels, res.locals.user, dateRange, sum, indexes);
            }
          });
          _context.next = 22;
          break;

        case 16:
          queryDateFrom = new Date(df);
          queryDateTo = new Date(dt);
          _context.next = 20;
          return regeneratorRuntime.awrap(Travel.find({
            _user: res.locals.user._id,
            $and: [{
              dateFrom: {
                $gte: queryDateFrom
              }
            }, {
              dateFrom: {
                $lte: queryDateTo
              }
            }]
          }));

        case 20:
          travels = _context.sent;
          totalSum = Travel.aggregate([{
            '$match': {
              '_user': res.locals.user._id,
              $and: [{
                dateFrom: {
                  $gte: queryDateFrom
                }
              }, {
                dateFrom: {
                  $lte: queryDateTo
                }
              }]
            }
          }, {
            '$group': {
              '_id': null,
              'sum': {
                '$sum': '$total'
              }
            }
          }], function (err, result) {
            if (err) {
              next(err);
            } else {
              var sum;

              if (result.length === 0) {
                sum = 0;
              } else {
                sum = Number(result[0].sum);
              }

              var x = 'x'; // console.log(typeof x);
              // console.log(travelIndexes);
              // console.log(typeof travelIndexes[63]);

              travels.forEach(function (item, idx) {
                travelIndexes.forEach(function (item, idx, object) {
                  object[idx] = item.toString();
                });
                var matchIndex = travelIndexes.indexOf(item._id.toString()) + 1;
                indexes.push(matchIndex);
              });
              createTravelsTotalPDF(res, travels, res.locals.user, dateRange, sum, indexes);
            }
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  });
};
/*
 * GET /travels/:id/pdf
 * Create, open in new tab and save PDF for displayed travel
 */


exports.getTravelExpensesPDF = function _callee2(req, res, next) {
  var invoiceNumberArray, idx, stream, filename;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.aggregate([{
            '$project': {
              'index': {
                '$indexOfArray': ['$travels', new ObjectId(res.locals.travel._id)]
              }
            }
          }, {
            '$match': {
              '_id': new ObjectId(req.user._id)
            }
          }]));

        case 2:
          invoiceNumberArray = _context2.sent;
          idx = invoiceNumberArray[0].index + 1;
          console.log(idx);
          stream = travelExpensesToPDF(res.locals.travel, req.user, idx);
          filename = "TReport_".concat(req.user._id, "_").concat(res.locals.travel._id, "_").concat(idx, ".pdf"); // Be careful of special characters

          filename = encodeURIComponent(filename); // Ideally this should strip them

          res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
          res.setHeader('Content-type', 'application/pdf');
          stream.pipe(res);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};
/*
 * GET /travels
 * All travels
 */


exports.getTravels = function _callee3(req, res) {
  var filter, sortBy, searchMinDate, searchMaxDate, minDate, maxDate, yearMin, yearMax, years;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          years = [];
          filter = req.query.filter;

          if (!filter) {
            filter = 'All';
          }

          sortBy = req.query.sortBy;

          if (!sortBy) {
            sortBy = '-dateFrom';
          }

          searchMinDate = req.query.minDate;
          searchMaxDate = req.query.maxDate;
          _context3.prev = 7;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Travel.aggregate([{
            '$match': {
              '_user': req.user._id,
              _id: {
                $in: req.user.travels
              }
            }
          }, {
            '$group': {
              '_id': req.user._id,
              'minDate': {
                '$min': '$dateFrom'
              },
              'maxDate': {
                '$max': '$dateFrom'
              }
            }
          }], function (err, doc) {
            if (err) {
              next(err);
            }

            if (doc.length != 0) {
              minDate = moment(doc[0].minDate).format('YYYY-MM-DD');
              maxDate = moment(doc[0].maxDate).format('YYYY-MM-DD');
              yearMin = moment(doc[0].minDate).format('YYYY');
              yearMax = moment().format('YYYY');

              for (i = Number(yearMax); i >= Number(yearMin); i--) {
                years.push(i);
              }
            } else {
              minDate = maxDate = moment().format('YYYY-MM-DD');
              yearMin = yearMax = moment().format('YYYY');
              years = [yearMin];
            }

            if (!searchMinDate) {
              searchMinDate = minDate;
            }

            if (!searchMaxDate) {
              searchMaxDate = maxDate;
            }

            Travel.find({
              _id: {
                $in: req.user.travels
              },
              $and: [{
                dateFrom: {
                  $gte: new Date(searchMinDate)
                }
              }, {
                dateFrom: {
                  $lte: new Date(searchMaxDate)
                }
              }]
            }).sort(sortBy).then(function (docs) {
              var travels = docs;
              res.render('travels/travels', {
                title: 'Travels',
                travels: travels,
                filter: filter,
                searchMinDate: searchMinDate,
                searchMaxDate: searchMaxDate,
                years: years
              });
            });
          }));

        case 10:
          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](7);
          next(_context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 12]]);
};
/*
 * GET /travels/new
 * Form to post new travel
 */


exports.getNewTravel = function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          res.render('travels/new', {
            title: 'New travel',
            user: req.user
          });

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};
/*
 * POST /travels/new
 * Create new travel based on user input
 */


exports.postNewTravel = function _callee5(req, res, next) {
  var decimalOptions, dateCompare, errors, dateFrom, dateTo, travel, doc;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          req.assert('description', 'Description is empty or to long (max 60 characters)!').isLength({
            min: 1,
            max: 60
          });
          req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({
            min: 3,
            max: 3
          });
          decimalOptions = {
            decimal_digits: 2
          };
          req.assert('perMileAmount', 'Per mile amount should be positive number with 2 decimals!').isDecimal(decimalOptions);
          dateCompare = moment(req.body.dateTo).add(1, 'days').format('YYYY-MM-DD');
          req.assert('dateFrom', 'Date from should be before date to').isBefore(dateCompare);
          errors = req.validationErrors();

          if (!errors) {
            _context5.next = 10;
            break;
          }

          req.flash('errors', errors);
          return _context5.abrupt("return", res.redirect('/travels/new'));

        case 10:
          dateFrom = new Date(req.body.dateFrom);
          dateTo = new Date(req.body.dateTo);
          travel = new Travel({
            _user: req.user._id,
            description: req.body.description.replace(/\s+/g, " ").trim(),
            dateFrom: dateFrom,
            dateTo: dateTo,
            homeCurrency: req.body.homeCurrency,
            perMileAmount: req.body.perMileAmount
          });
          _context5.prev = 13;
          _context5.next = 16;
          return regeneratorRuntime.awrap(travel.save());

        case 16:
          doc = _context5.sent;
          _context5.next = 19;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            $addToSet: {
              'travels': doc._id
            }
          }, function (err, user) {
            if (err) {
              return next(err);
            }
          }));

        case 19:
          _context5.next = 24;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](13);
          return _context5.abrupt("return", next(_context5.t0));

        case 24:
          req.flash('success', {
            msg: 'Successfully added new travel!'
          });
          res.redirect('/travels');

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[13, 21]]);
};
/*
 * GET /travels/:id
 * Show choosen travel
 */


exports.getTravel = function _callee6(req, res, next) {
  var id, travel, expenses;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;

          if (ObjectId.isValid(id)) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", next(new Error('Not valid Object Id')));

        case 3:
          travel = res.locals.travel;
          _context6.prev = 4;
          expenses = travel.expenses;
          expenses.forEach(function (expense, index, arr) {
            if (expense.type != 'Mileage') {
              var rate = Object.values(expense.curRate.rate)[0];
              expense.rate = rate.toFixed(2);
            } else {
              expense.rate = travel.perMileAmount;
            }
          });

          if (travel) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", next(new Error('Travel not found')));

        case 9:
          res.render('travels/travel', {
            title: 'Travel',
            travel: travel,
            expenses: expenses,
            expenseTypes: expenseTypes,
            constants: constants,
            rates: JSON.stringify(res.locals.rates)
          });
          _context6.next = 15;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](4);
          return _context6.abrupt("return", next(_context6.t0));

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 12]]);
};
/*
 * DELETE /travels/:id
 * Delete chosen/displayed travel
 */


exports.deleteTravel = function _callee7(req, res, next) {
  var id, travel;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          id = req.params.id;

          if (ObjectId.isValid(id)) {
            _context7.next = 3;
            break;
          }

          return _context7.abrupt("return", next(new Error('Not valid Object Id')));

        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(Travel.findOneAndDelete({
            _id: id,
            _user: req.user._id
          }));

        case 6:
          travel = _context7.sent;

          if (travel) {
            _context7.next = 10;
            break;
          }

          req.flash('error', {
            msg: 'Travel not found!!'
          });
          return _context7.abrupt("return", next(new Error('Travel not found')));

        case 10:
          Expense.deleteMany({
            travel: travel._id,
            _user: req.user._id
          }, function (err) {
            if (err) {
              return next(err);
            }
          });
          User.findByIdAndUpdate(req.user._id, {
            $pullAll: {
              'travels': [travel._id]
            }
          }, function (err, user) {
            if (!err) {
              return next(err);
            }
          });
          req.flash('info', {
            msg: 'Travel successfully deleted!'
          });
          res.redirect('/travels');
          _context7.next = 19;
          break;

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](3);
          return _context7.abrupt("return", next(_context7.t0));

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 16]]);
};
/*
 * PATCH /travels/new
 * Update travel information
 * If travel's expenses dates are not within travel date range, update expenses and recalculate travel total
 */


exports.updateTravel = function _callee8(req, res, next) {
  var currencyOptions, dateCompare, errors, id, body, travel;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          currencyOptions = {
            allow_negatives: false,
            allow_negative_sign_placeholder: true,
            thousands_separator: ',',
            decimal_separator: '.',
            allow_decimal: true,
            require_decimal: false,
            digits_after_decimal: [2],
            allow_space_after_digits: false
          };
          req.assert('description', 'Description is empty or to long (max 120 characters)!').isLength({
            min: 1,
            max: 60
          });
          req.assert('homeCurrency', 'Home currency should have exactly 3 characters!').isLength({
            min: 3,
            max: 3
          });
          req.assert('perMileAmount', 'Per mile amount should be positive number with 2 decimals!').isNumeric().isCurrency(currencyOptions);
          dateCompare = moment(req.body.dateTo).add(1, 'days').format('YYYY-MM-DD');
          req.assert('dateFrom', 'Date from should be before date to').isBefore(dateCompare);
          errors = req.validationErrors();
          id = req.params.id;

          if (!errors) {
            _context8.next = 11;
            break;
          }

          req.flash('errors', errors);
          return _context8.abrupt("return", res.redirect("/travels/".concat(id)));

        case 11:
          // Get data from html form to update travel
          body = _.pick(req.body, ['description', 'dateFrom', 'dateTo', 'homeCurrency', 'perMileAmount']);

          if (ObjectId.isValid(id)) {
            _context8.next = 14;
            break;
          }

          return _context8.abrupt("return", next(new Error('Not valid Object Id')));

        case 14:
          _context8.prev = 14;
          _context8.next = 17;
          return regeneratorRuntime.awrap(Travel.findOneAndUpdate({
            _id: id,
            _user: req.user.id
          }, {
            $set: body
          }, {
            "new": true
          }).populate({
            path: 'expenses',
            populate: {
              path: 'curRate'
            }
          }));

        case 17:
          travel = _context8.sent;

          if (travel) {
            _context8.next = 20;
            break;
          }

          return _context8.abrupt("return", next(new Error('Travel not found')));

        case 20:
          /*
           * Check expenses dates and set them within travel dates.
           * Calculate travel total. New expenses date, new rate.
           * Rates for same currency are not the same for different dates.
           */
          updateExpensesToMatchTravelRangeDates(travel, res.locals.rates).then(function (expenses) {
            travel.save().then(function (doc) {
              Travel.findOne({
                _id: doc._id,
                _user: req.user.id
              }).populate({
                path: 'expenses',
                populate: {
                  path: 'curRate'
                }
              }).then(function (doc) {
                doc.updateTotal().then(function (doc) {
                  req.flash('success', {
                    msg: 'Travel successfully updated!'
                  });
                  res.redirect('/travels');
                });
              });
            });
          });
          _context8.next = 26;
          break;

        case 23:
          _context8.prev = 23;
          _context8.t0 = _context8["catch"](14);
          return _context8.abrupt("return", next(_context8.t0));

        case 26:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[14, 23]]);
};

/***/ }),

/***/ "./controllers/user.js":
/*!*****************************!*\
  !*** ./controllers/user.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// jshint esversion: 6
var _require = __webpack_require__(/*! util */ "util"),
    promisify = _require.promisify;

var crypto = __webpack_require__(/*! crypto */ "crypto");

var nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");

var passport = __webpack_require__(/*! passport */ "passport");

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");

var Travel = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js");

var Expense = __webpack_require__(/*! ../models/Expense */ "./models/Expense.js");

var toTitleCase = __webpack_require__(/*! ../utils/utils */ "./utils/utils.js").toTitleCase;

var mailjet = __webpack_require__(/*! node-mailjet */ "node-mailjet").connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

var randomBytesAsync = promisify(crypto.randomBytes);
/**
 * GET /login
 * Login page.
 */

exports.getLogin = function (req, res) {
  if (req.user) {
    return res.redirect('/');
  }

  res.render('account/login', {
    title: 'Login'
  });
};
/**
 * POST /login
 * Sign in using email and password.
 */


exports.postLogin = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({
    gmail_remove_dots: false
  });
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      req.flash('success', {
        msg: 'Success! You are logged in.'
      });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};
/**
 * GET /logout
 * Log out.
 */


exports.logout = function (req, res) {
  req.logout();
  req.session.destroy(function (err) {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};
/**
 * GET /signup
 * Signup page.
 */


exports.getSignup = function (req, res) {
  if (req.user) {
    return res.redirect('/');
  }

  res.render('account/signup', {
    title: 'Create Account'
  });
};
/**
 * POST /signup
 * Create a new local account.
 */


exports.postSignup = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.assert('fName', 'First name should not be empty').notEmpty();
  req.assert('lName', 'Last name should not be empty').notEmpty();
  req.assert('team', 'Team should not be empty').notEmpty();
  req.assert('jobPosition', 'Position should not be empty').notEmpty();
  req.sanitize('email').normalizeEmail({
    gmail_remove_dots: false
  });
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: {
      fName: req.body.fName,
      lName: req.body.lName
    },
    team: req.body.team,
    jobPosition: req.body.jobPosition
  });
  User.findOne({
    email: req.body.email
  }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      req.flash('errors', {
        msg: 'Account with that email address already exists.'
      });
      return res.redirect('/signup');
    }

    user.save(function (err) {
      if (err) {
        return next(err);
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        res.redirect('/');
      });
    });
  });
};
/**
 * GET /account
 * Profile page.
 */


exports.getAccount = function (req, res) {
  if (req.query.length != 0) {
    var team = req.query.team;
    var jobPosition = req.query.jobPosition;

    if (team === '') {
      req.flash('info', {
        msg: 'To create PDF you need to define TEAM'
      });
    }

    if (jobPosition === '') {
      req.flash('info', {
        msg: 'To create PDF you need to define POSITION'
      });
    }
  }

  res.render('account/profile', {
    title: 'Account Management'
  });
};
/**
 * POST /account/profile
 * Update profile information.
 */


exports.postUpdateProfile = function (req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.assert('homeCurrency', 'Home currency should have exactly 3 characters').isLength({
    min: 3,
    max: 3
  });
  req.assert('perMileAmount', 'Per mile amount should be number').isNumeric();
  req.assert('fName', 'First name should not be empty').notEmpty();
  req.assert('lName', 'Last name should not be empty').notEmpty();
  req.assert('team', 'Team should not be empty').notEmpty();
  req.assert('jobPosition', 'Position should not be empty').notEmpty();
  req.sanitize('email').normalizeEmail({
    gmail_remove_dots: false
  });
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err);
    }

    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.fName = req.body.fName || '';
    user.profile.lName = req.body.lName || '';
    user.team = req.body.team || '';
    user.jobPosition = req.body.jobPosition || '';
    user.profile.gender = req.body.gender || '';
    user.homeCurrency = req.body.homeCurrency.toUpperCase() || '';
    user.homeDistance = req.body.homeDistance || '';
    user.perMileAmount = req.body.perMileAmount || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save(function (err) {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {
            msg: 'The email address you have entered is already associated with an account.'
          });
          return res.redirect('/account');
        }

        return next(err);
      }

      req.flash('success', {
        msg: 'Profile information has been updated.'
      });
      res.redirect('/account');
    });
  });
};
/**
 * POST /account/password
 * Update current password.
 */


exports.postUpdatePassword = function (req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err);
    }

    user.password = req.body.password;
    user.save(function (err) {
      if (err) {
        return next(err);
      }

      req.flash('success', {
        msg: 'Password has been changed.'
      });
      res.redirect('/account');
    });
  });
};
/**
 * POST /account/delete
 * Delete user account.
 */


exports.postDeleteAccount = function (req, res, next) {
  var travelsIds = req.user.travels;
  Expense.deleteMany({
    travel: {
      $in: travelsIds
    }
  }, function (err, docs) {
    if (err) {
      next(err);
    }
  });
  Travel.deleteMany({
    _user: req.user._id
  }, function (err, docs) {
    if (err) {
      next(err);
    }
  });
  User.deleteOne({
    _id: req.user.id
  }, function (err) {
    if (err) {
      return next(err);
    }

    req.logout();
    req.flash('info', {
      msg: 'Your account has been deleted.'
    });
    res.redirect('/');
  });
};
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */


exports.getOauthUnlink = function (req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function (err, user) {
    if (err) {
      return next(err);
    }

    var lowerCaseProvider = provider.toLowerCase();
    var titleCaseProvider = toTitleCase(provider);
    user[lowerCaseProvider] = undefined;
    var tokensWithoutProviderToUnlink = user.tokens.filter(function (token) {
      return token.kind !== lowerCaseProvider;
    }); // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.

    if (!(user.email && user.password) && tokensWithoutProviderToUnlink.length === 0) {
      req.flash('errors', {
        msg: "The ".concat(titleCaseProvider, " account cannot be unlinked without another form of login enabled.") + ' Please link another account or add an email address and password.'
      });
      return res.redirect('/account');
    }

    user.tokens = tokensWithoutProviderToUnlink;
    user.save(function (err) {
      if (err) {
        return next(err);
      }

      req.flash('info', {
        msg: "".concat(titleCaseProvider, " account has been unlinked.")
      });
      res.redirect('/account');
    });
  });
};
/**
 * GET /reset/:token
 * Reset Password page.
 */


exports.getReset = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  User.findOne({
    passwordResetToken: req.params.token
  }).where('passwordResetExpires').gt(Date.now()).exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash('errors', {
        msg: 'Password reset token is invalid or has expired.'
      });
      return res.redirect('/forgot');
    }

    res.render('account/reset', {
      title: 'Password Reset'
    });
  });
};
/**
 * POST /reset/:token
 * Process the reset password request.
 */


exports.postReset = function (req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  var resetPassword = function resetPassword() {
    return User.findOne({
      passwordResetToken: req.params.token
    }).where('passwordResetExpires').gt(Date.now()).then(function (user) {
      if (!user) {
        req.flash('errors', {
          msg: 'Password reset token is invalid or has expired.'
        });
        return res.redirect('back');
      }

      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      return user.save().then(function () {
        return new Promise(function (resolve, reject) {
          req.logIn(user, function (err) {
            if (err) {
              return reject(err);
            }

            resolve(user);
          });
        });
      })["catch"](function (err) {
        return err;
      });
    })["catch"](function (err) {
      return err;
    });
  };

  var sendResetPasswordEmail = function sendResetPasswordEmail(user) {
    if (!user) {
      return;
    }

    var sendEmail = mailjet.post('send', {
      version: 'v3.1'
    });
    var emailData = {
      "Messages": [{
        "From": {
          "Email": "jaka.daneu@siol.net",
          "Name": "Mailjet Pilot"
        },
        "To": [{
          "Email": user.email,
          "Name": user.fullName()
        }],
        'Subject': 'Your password for TExpenses has been changed',
        'TextPart': "Hello,\n\nThis is a confirmation that the password for your account ".concat(user.email, " has just been changed.\n")
      }]
    };
    return sendEmail.request(emailData).then(function (response) {
      req.flash('success', {
        msg: 'Success! Your password has been changed.'
      });
    })["catch"](function (err) {
      if (err.message === 'self signed certificate in certificate chain') {
        console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
        req.flash('success', {
          msg: 'Success! Your password has been changed.'
        });
      }

      console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
      req.flash('warning', {
        msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.'
      });
      return err;
    });
  };

  resetPassword().then(sendResetPasswordEmail).then(function () {
    if (!res.finished) res.redirect('/');
  })["catch"](function (err) {
    return next(err);
  });
};
/**
 * GET /forgot
 * Forgot Password page.
 */


exports.getForgot = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};
/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */


exports.postForgot = function (req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({
    gmail_remove_dots: false
  });
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  var createRandomToken = randomBytesAsync(16).then(function (buf) {
    return buf.toString('hex');
  });

  var setRandomToken = function setRandomToken(token) {
    return User.findOne({
      email: req.body.email
    }).then(function (user) {
      if (!user) {
        req.flash('errors', {
          msg: 'Account with that email address does not exist.'
        });
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour

        user = user.save();
      }

      return user;
    });
  };

  var sendForgotPasswordEmail = function sendForgotPasswordEmail(user) {
    if (!user) {
      return;
    }

    var token = user.passwordResetToken;
    var sendEmail = mailjet.post('send', {
      version: 'v3.1'
    });
    var emailData = {
      "Messages": [{
        "From": {
          "Email": "jaka.daneu@siol.net",
          "Name": "TExpenses App"
        },
        "To": [{
          "Email": user.email,
          "Name": user.fullName()
        }],
        'Subject': 'Reset your password for TExpenses',
        'TextPart': "You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n\n            //       Please click on the following link, or paste this into your browser to complete the process:\n\n\n            //       http://".concat(req.headers.host, "/reset/").concat(token, "\n\n\n            //       If you did not request this, please ignore this email and your password will remain unchanged.\n")
      }]
    };
    return sendEmail.request(emailData).then(function (response) {
      req.flash('info', {
        msg: "An e-mail has been sent to ".concat(user.email, " with further instructions.")
      });
    })["catch"](function (err) {
      if (err.message === 'self signed certificate in certificate chain') {
        console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
      }

      req.flash('errors', {
        msg: 'Error sending the password reset message. Please try again shortly.'
      });
      return err;
    });
  };

  createRandomToken.then(setRandomToken).then(sendForgotPasswordEmail).then(function () {
    return res.redirect('/login');
  })["catch"](next);
};

/***/ }),

/***/ "./lib/constants.js":
/*!**************************!*\
  !*** ./lib/constants.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * Constants Object
 * Convert miles to kilometers
 * Convert kilometers to miles
 * Header in travels.csv
 * Header in expenses.csv
 */
module.exports = Object.freeze({
  MILES_TO_KILOMETERS: 1.609344,
  KILOMETERS_TO_MILES: 0.621371,
  IMPORT_TRAVEL_HEADER: ['dateFrom', 'dateTo', 'description', 'homeCurrency', 'perMileAmount', 'total'],
  IMPORT_EXPENSE_HEADER: ['type', 'description', 'date', 'amount', 'currency', 'rate', 'amountConverted', 'unit', 'travelName', 'base']
});

/***/ }),

/***/ "./lib/globals.js":
/*!************************!*\
  !*** ./lib/globals.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

var expenseTypes = ['Flight', 'Hotel', 'Mileage', 'Meal', 'Rent a car', 'Toll', 'Gas', 'Other'];
var allHtml = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'travelButtonEditOptionsb', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'];
var emptyHTML = ['area', 'base', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
module.exports = {
  expenseTypes: expenseTypes,
  allHtml: allHtml,
  emptyHTML: emptyHTML
};

/***/ }),

/***/ "./models/Currency.js":
/*!****************************!*\
  !*** ./models/Currency.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Currency Schema
 * base: base currency => to currency
 * date: conversion date
 * rate: object => key: from currency, value: conversion rate
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 *
 * amount in rate currency divide with rate[currency]
 * converted amount = (amount in rate's key)/(currency.rate["EUR"])
 * EXAMPLE:
 * currency = {base: "USD", date: 2017-11-18T00:00:00.000+00:00, rate: {EUR: 0.89}}
 * convert 100 EUR to USD = 100/currency.rate["EUR"]
 * 100 EUR = 100/0.89 = 112.36 USD
 */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var CurrencySchema = new mongoose.Schema({
  base: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  rate: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});
var Currency = mongoose.model('Currency', CurrencySchema);
module.exports = Currency;

/***/ }),

/***/ "./models/Expense.js":
/*!***************************!*\
  !*** ./models/Expense.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Expense Schema
 * travel: link to travel => travel._id from travels collection
 * type: possible expense type => ./lib/globals.expenseTypes
 * decription: expense description
 * date: expense date
 * currency: TODO implement validation => length=3 & make upper case
 * curRate: link to currency => currency._id from currencies collection
 * unit: only if expense type is Mileage based on user's unit(user.homeDistance) => userSchema in ./models/User.js
 * amount: amount spent in local currency or distance in unit
 * amountConverted: converted amount based on user's currency(homeCurrency) or user's per distance conversion(user.perMileAmount) => userSchema in ./models/User.js
 * _user: link to user => user._id from users collection
 */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var moment = __webpack_require__(/*! moment */ "moment");

var _require = __webpack_require__(/*! ../models/User */ "./models/User.js"),
    User = _require.User;

var _require2 = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js"),
    Travel = _require2.Travel;

var _require3 = __webpack_require__(/*! ../models/Currency */ "./models/Currency.js"),
    Currency = _require3.Currency;

var ObjectId = mongoose.Schema.Types.ObjectId;
var ExpenseSchema = new mongoose.Schema({
  travel: {
    type: ObjectId,
    required: true,
    ref: 'Travel'
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  currency: {
    type: String
  },
  curRate: {
    type: ObjectId,
    ref: 'Currency'
  },
  unit: {
    type: String
  },
  amount: {
    type: mongoose.Decimal128
  },
  amountConverted: {
    type: mongoose.Decimal128,
    "default": 0.00
  },
  _user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});
var Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;

/***/ }),

/***/ "./models/Rate.js":
/*!************************!*\
  !*** ./models/Rate.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Rates Schema
 * Same object as data from data.fixer.io
 * success: if response was successful
 * timestamp: when was data collected in Unix timestamp - multiple with 1000 to get time in milliseconds and then convert to date
 * base: for which currency are rates
 * rates: object with all rates to convert from => {USD: 1.12, HRK: 7.45, GBP: 0.88, ....}
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var RateSchema = new mongoose.Schema({
  success: Boolean,
  timestamp: Number,
  base: String,
  date: Date,
  rates: Object
}, {
  timestamps: true
});
/*
 * Returns array with rates between two dates.
 * keys: [rates, date]
 */

RateSchema.statics.findRatesOnDate = function (travel, callback) {
  return this.find({
    $and: [{
      date: {
        $gte: travel.dateFrom
      }
    }, {
      date: {
        $lte: travel.dateTo
      }
    }]
  }, function (err, rates) {}).select({
    'rates': 1,
    'date': 1,
    '_id': 0
  });
};
/*
 * Returns array with rate close to travel dates
 * Use in case there is no rate for date inbetween travel dates
 * Rates are sorted ascending.
 * Limit to only one rates object.
 * keys: [rates, date]
 * TODO check if you can get better algorithm
 */


RateSchema.statics.findRateBeforeOrAfterDate = function (travel, callback) {
  return this.find({
    $or: [{
      date: {
        $gte: travel.dateFrom
      }
    }, {
      date: {
        $lte: travel.dateFrom
      }
    }]
  }, function (err, rates) {}).sort({
    "date": 1
  }).limit(1).select({
    'rates': 1,
    'date': 1,
    '_id': 0
  });
};

var Rate = mongoose.model('Rate', RateSchema);
module.exports = Rate;

/***/ }),

/***/ "./models/Travel.js":
/*!**************************!*\
  !*** ./models/Travel.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Travel Schema
 * _user: link to user => user._id from users collection
 * decription: travel description
 * dateFrom: travel start date
 * dateTo: travel end date
 * homeCurrency: currency to calculate all amounts to
 * perMileAmount: amount to convert distance to expense
 * expenses: array of expense' ids - links to expenses collection in DB => ExpenseSchema in ./models/Expense.js
 * total: total of all expenes linked to this travel
 * useNestedStrict: TODO useNestedStrict description
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 */
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");

var Expense = __webpack_require__(/*! ../models/Expense */ "./models/Expense.js");

var ObjectId = mongoose.Schema.Types.ObjectId;
var TravelSchema = new mongoose.Schema({
  _user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  description: {
    type: String,
    required: true
  },
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date,
    required: true
  },
  homeCurrency: {
    type: String,
    required: true
  },
  perMileAmount: {
    type: mongoose.Decimal128,
    "default": 0.00
  },
  expenses: [{
    type: ObjectId,
    ref: 'Expense'
  }],
  total: {
    type: mongoose.Decimal128,
    "default": 0.00
  }
}, {
  useNestedStrict: true,
  timestamps: true
});
/*
 * Helper method to update travel's total amount
 * Returns same document for which the total is calculated.
 * Before use you have to find document with populate expenses
 * EXAMPLE:
 * Travel
 * .findOne({_id: doc._id, _user: req.user.id})
 * .populate({path: 'expenses', populate: {path: 'curRate'}})
 * .then((doc) => {doc.updateTotal()}
 */

TravelSchema.methods.updateTotal = function (cb) {
  var _this = this;

  this.total = 0;
  this.expenses.forEach(function (expense) {
    _this.total = Number(_this.total) + Number(expense.amountConverted);
  });
  this.total = parseFloat(this.total).toFixed(2);
  return this.save();
};

TravelSchema.statics.byYear_byMonth = function (user, cb) {
  return this.aggregate([{
    '$match': {
      '_user': user._id
    }
  }, {
    '$sort': {
      'dateFrom': -1
    }
  }, {
    '$lookup': {
      from: 'expenses',
      localField: 'expenses',
      foreignField: '_id',
      as: 'expenses'
    }
  }, {
    '$lookup': {
      from: 'currencies',
      localField: 'expenses.curRate',
      foreignField: '_id',
      as: 'curRates'
    }
  }, {
    '$group': {
      '_id': {
        'month': {
          '$month': '$dateFrom'
        },
        'year': {
          '$year': '$dateFrom'
        }
      },
      'byMonth': {
        '$push': '$$ROOT'
      },
      'count': {
        '$sum': 1
      },
      'dateFirst': {
        '$first': '$dateFrom'
      },
      'dateLast': {
        '$last': '$dateFrom'
      }
    }
  }, {
    $sort: {
      'dateFirst': -1
    }
  }, {
    '$group': {
      '_id': {
        'year': {
          '$year': '$dateFirst'
        }
      },
      'byYear': {
        '$push': '$$ROOT'
      },
      'count': {
        '$sum': 1
      },
      'countTotal': {
        $sum: "$count"
      },
      'dateFirst': {
        '$first': '$dateFirst'
      },
      'dateLast': {
        '$last': '$dateLast'
      }
    }
  }, {
    $sort: {
      'dateFirst': -1
    }
  }]);
};

TravelSchema.statics.byMonth = function (user, cb) {
  return this.aggregate([{
    $match: {
      _user: user._id
    }
  }, {
    $group: {
      _id: {
        month: {
          $month: "$dateFrom"
        },
        year: {
          $year: "$dateFrom"
        }
      },
      travels: {
        $addToSet: "$_id"
      },
      myArray: {
        '$push': '$$ROOT'
      },
      count: {
        $sum: 1
      },
      date: {
        $first: "$dateFrom"
      }
    }
  }, {
    $project: {
      date: {
        $dateToString: {
          format: "%Y-%m",
          date: "$date"
        }
      },
      travels: '$travels',
      myArray: '$myArray',
      count: 1,
      _id: 0
    }
  }]);
};

var Travel = mongoose.model('Travel', TravelSchema);
module.exports = Travel;

/***/ }),

/***/ "./models/User.js":
/*!************************!*\
  !*** ./models/User.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * User Schema
 * email: login email
 * password: login password
 * passwordResetToken: token send to user to reset the password
 * passwordResetExpires: when passwordResetToken expires
 * google: google id when user signin or link the account
 * tokens: array of tokens
 * profile: object with user's name, gender, location, website, picture, first name (fName), last name (lName)
 * team: user's team
 * jobPosition: user's job
 * travels: array of travel' ids - links to travels collection in DB => TravelSchema in ./models/Expense.js
 * homeCurrency: currency to calculate all amounts to
 * homeDistance: to which linear measure expense will be calculate to: miles(mi) or kilometers(km)
 * perMileAmount: amount to convert distance to expense
 * timestamps: creates two values => createdAr, updatedAt - Mongoose Schema option
 */
var bcrypt = __webpack_require__(/*! bcrypt-nodejs */ "bcrypt-nodejs");

var crypto = __webpack_require__(/*! crypto */ "crypto");

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  google: String,
  tokens: Array,
  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String,
    fName: String,
    lName: String
  },
  team: {
    type: String,
    maxlength: 30
  },
  jobPosition: {
    type: String,
    maxlength: 30
  },
  travels: Array,
  homeCurrency: {
    type: String,
    "default": 'USD'
  },
  homeDistance: {
    type: String,
    "default": 'mi'
  },
  perMileAmount: {
    type: Number,
    "default": 0.54
  }
}, {
  timestamps: true
});
/**
 * Password hash middleware.
 */

userSchema.pre('save', function save(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});
/**
 * Helper method for validating user's password.
 */

userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    cb(err, isMatch);
  });
};
/**
 * Helper method for getting user's gravatar.
 */


userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }

  if (!this.email) {
    return "https://gravatar.com/avatar/?s=".concat(size, "&d=retro");
  }

  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return "https://gravatar.com/avatar/".concat(md5, "?s=").concat(size, "&d=retro");
};
/**
* Helper method for getting user's full name
*/


userSchema.methods.fullName = function fullName() {
  var result = this.profile.fName + ' ' + this.profile.lName;
  return result;
};

var User = mongoose.model('User', userSchema);
module.exports = User;

/***/ }),

/***/ "./utils/getRates.js":
/*!***************************!*\
  !*** ./utils/getRates.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var axios = __webpack_require__(/*! axios */ "axios");

var schedule = __webpack_require__(/*! node-schedule */ "node-schedule");

var moment = __webpack_require__(/*! moment */ "moment");

var Rate = __webpack_require__(/*! ../models/Rate */ "./models/Rate.js");
/*
 * Retrieve rates from data.fixer.io and save it to DB
 * @param {string} today                    Now YYYY-MM-DD format
 * @param {object} response                 Axios response from data.fixer.io/api/latest
 * @param {boolean} response.data.success
 * @param {number} response.data.timestamp
 * @param {string} response.data.base       Base currency - 3 capital letters
 * @param {string} response.data.date       Date for rates
 * @param {object} response.data.rates      Object with keys as rates (3 capital letters), values as rate
 * @param {object} data                     Mongoose Rate model - see /models/Rate.js
 */


var dataFixier = function dataFixier() {
  var response, data;
  return regeneratorRuntime.async(function dataFixier$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get("http://data.fixer.io/api/latest?access_key=".concat(process.env.DATA_FIXER_IO)));

        case 3:
          response = _context.sent;

          if (!(response.data.success && moment(response.data.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))) {
            _context.next = 10;
            break;
          }

          data = new Rate(response.data);
          _context.next = 8;
          return regeneratorRuntime.awrap(data.save().then(function (rates) {
            console.log("Rates for ".concat(moment(rates.date), ",\ncollected on ").concat(new Date(rates.timestamp * 1000), ",\ncreated on ").concat(moment(rates.createdAt)));
          }));

        case 8:
          _context.next = 11;
          break;

        case 10:
          if (moment(response.data.date).format('YYYY-MM-DD') != moment().format('YYYY-MM-DD')) {
            console.log("Wrong response data date: ".concat(moment(response.data.date).format('YYYY-MM-DD'), " - Should be ").concat(moment().format('YYYY-MM-DD')));
          } else {
            console.log("Could't get rates from data.fixer.io");
            console.log(response.data);
          }

        case 11:
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};
/*
 * @typedef Rate
 * @param {boolean} success
 * @param {number} timestamp
 * @param {string} base
 * @param {string} date
 * @param {object} rates
 */

/*
 * Check if today rates alredy exists in DB, resolve as array of rates documents(objects), reject as error
 * @param {string} today Now YYYY-MM-DD format
 * @param {object} rates Info about rates or error
 * @return Promise<Rate> Array of MongoDB documents
 */


var checkDbForTodayRates = new Promise(function _callee(resolve, reject) {
  var today, rates;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          today = moment(new Date()).format('YYYY-MM-DD');
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Rate.find({
            date: today
          }));

        case 4:
          rates = _context2.sent;
          resolve(rates);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          reject(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
/*
 * getRates module
 * const getRates = require(./getRates)
 * Use it once after connectef to DB - getRates()
 * It checks imediatelly if for today document exists in database and
 * creates new node-schedule job to repeat every first minute in the hour
 * module: utils/getRates
 * @param {string} today Now YYYY-MM-DD format
 */

/** GET RATES FROM DATA.FIXER.IO/API. */

module.exports = function _callee2() {
  var today, rule, job;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          today = moment().format('YYYY-MM-DD');
          checkDbForTodayRates.then(function (rates) {
            if (rates.length === 0) {
              console.log("".concat(moment(new Date()), " - Rates for ").concat(today, " not yet in DB. Retrieving rates..."));
              dataFixier();
            } else {
              console.log("".concat(moment(new Date()), " - Rates for ").concat(today, " already in DB"));
            }
          })["catch"](function (err) {
            console.log(err);
          });
          rule = new schedule.RecurrenceRule();
          rule.minute = 1;
          job = schedule.scheduleJob(rule, function () {
            var today = moment().format('YYYY-MM-DD');

            try {
              var rates = checkDbForTodayRates;

              if (rates.length === 0) {
                console.log("".concat(moment(new Date()), " - Rates for ").concat(today, " not yet in DB. Retrieving rates..."));
                dataFixier();
              } else {
                console.log("".concat(moment(new Date()), " - Rates for ").concat(today, " already in DB"));
              }
            } catch (err) {
              console.log(err);
            }
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

/***/ }),

/***/ "./utils/hbsHelpers/hbsHelpers.js":
/*!****************************************!*\
  !*** ./utils/hbsHelpers/hbsHelpers.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var expressHbs = __webpack_require__(/*! express-hbs */ "express-hbs");

var moment = __webpack_require__(/*! moment */ "moment");

var createElement = __webpack_require__(/*! ../utils */ "./utils/utils.js").createElement;

expressHbs.registerHelper('flash', function (message) {
  if (message.error) {
    return message.error;
  }

  if (message.info) {
    return message.info;
  }

  if (message.success) {
    return message.success;
  }
}); // expressHbs.registerHelper('gravatar', (user) => {
//   return user.gravatar(60);
// })

expressHbs.registerHelper('debug', function (data, breakpoint) {
  console.log(data);

  if (breakpoint === true) {
    debugger;
  }

  return '';
});
expressHbs.registerHelper('gender', function (userGender, radioButtonGender) {
  return userGender == radioButtonGender;
});
expressHbs.registerHelper("setChecked", function (value, currentValue) {
  if (value == currentValue) {
    return "checked";
  } else {
    return "";
  }
});
expressHbs.registerHelper("setOption", function (value, currentValue) {
  if (value == currentValue) {
    return "selected='selected'";
  } else {
    return;
  }
});
expressHbs.registerHelper('setValue', function (value) {
  return "value=".concat(value);
});
expressHbs.registerHelper('countList', function (value) {
  return value + 1;
});
expressHbs.registerHelper('formatDate', function (date) {
  if (!date) {
    var today = moment().format('YYYY-MM-DD');
    return today;
  } else {
    var _today = moment(date).format('YYYY-MM-DD');

    return _today;
  }
});
expressHbs.registerHelper('formatMonth', function (date) {
  if (!date) {
    var today = moment().format('MMMM, YYYY');
    return today;
  } else {
    var _today2 = moment(date).format('MMMM, YYYY');

    return _today2;
  }
});
expressHbs.registerHelper('travelsList', function (items, options) {
  var out = "<ul>";

  for (var i = 0, length = items.length; i < length; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});
expressHbs.registerHelper('setUnit', function (homeDistance) {
  if (homeDistance === 'mi') {
    return 'mile';
  } else if (homeDistance === 'km') {
    return 'km';
  } else {
    return '';
  }
});
expressHbs.registerHelper('setUnit2', function (homeDistance) {
  if (homeDistance != 'mi') {
    return 'mile';
  } else if (homeDistance != 'km') {
    return 'km';
  } else {
    return '';
  }
});
expressHbs.registerHelper('toNumber', function (valueAsString) {
  return parseFloat(valueAsString);
});
expressHbs.registerHelper('getRate', function (travelCurrencies, currency) {
  var item = travelCurrencies.find(function (item) {
    return item.currency.name === currency;
  });
  return item.value;
});
expressHbs.registerHelper('toCurrency', function (number) {
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  var numberString = formatter.format(number);
  return numberString;
});

/***/ }),

/***/ "./utils/hbsHelpers/yearsAccordion.js":
/*!********************************************!*\
  !*** ./utils/hbsHelpers/yearsAccordion.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var expressHbs = __webpack_require__(/*! express-hbs */ "express-hbs");

var moment = __webpack_require__(/*! moment */ "moment");

var createElement = __webpack_require__(/*! ../utils */ "./utils/utils.js").createElement;

var createTwoCardElements = __webpack_require__(/*! ../utils */ "./utils/utils.js").createTwoCardElements;

var _require = __webpack_require__(/*! ../../lib/globals */ "./lib/globals.js"),
    expenseTypes = _require.expenseTypes;

var constants = __webpack_require__(/*! ../../lib/constants */ "./lib/constants.js");
/*
 * Returns expense curRate object-
 * @param {object} travel
 * @param {object} expense
 *
 * Could't populate on travel aggregate expense curRate.
 * Travel Object has new array with unique curRate objects.
 */


var findCurRate = function findCurRate(travel, expense) {
  var currency_unit, curRate;

  if (expense.type != 'Mileage') {
    currency_unit = expense.currency;
    curRate = travel.curRates.find(function (cr) {
      return cr._id.toString() === expense.curRate.toString();
    });
  } else {
    curRate = false;
  }

  return curRate;
};
/*
 * Creates HTML 'option' elements
 * @param {array} options            Select or datalist options
 * @param {string} selected           Option to be selected
 * @param {object} elemAttrs          HTML element attributes
 * @param {boolean} valueToLowerCase  whether to set option's value to lower case
 *
 */


var createSelectOptions = function createSelectOptions(options, selected) {
  var elemAttrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var valueToLowerCase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var result = '';
  selected = !selected ? '' : selected;
  options.forEach(function (val) {
    // console.log(val);
    var optionVal = valueToLowerCase ? val.toLowerCase() : val; // console.log(optionVal, val, selected);

    elemAttrs.value = optionVal;

    if (optionVal.toLowerCase() === selected.toLowerCase()) {
      elemAttrs.selected = 'selected';
    }

    ;
    var htmlElem = createElement('option', elemAttrs, val);

    if (elemAttrs.selected) {
      delete elemAttrs.selected;
    }

    result = result + htmlElem;
  });
  delete elemAttrs.value;
  return result;
};

var createFormRow = function createFormRow() {};

var createExpenseForm = function createExpenseForm() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'POST';
  var hiddenMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : method;
  var csrf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var expenseTypes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var travel = arguments.length > 4 ? arguments[4] : undefined;
  var expense = arguments.length > 5 ? arguments[5] : undefined;
  var formatter = arguments.length > 6 ? arguments[6] : undefined;

  if (!travel || !expense) {
    return;
  }

  var curRate = findCurRate(travel, expense);
  var mileage = expense.type === 'Mileage' ? true : false;
  method = method.toUpperCase();
  hiddenMethod = hiddenMethod.toUpperCase(); // hidden INPUT OPTIONS

  var hiddenInputOptions = {
    type: 'hidden',
    name: '_csrf',
    value: csrf
  }; // div row OPTIONS

  var divRowOptions = {
    "class": 'form-group my-1',
    style: ''
  };
  var divElemOptions = {}; // label TAGS & OPTIONS, form elements OPTIONS

  var htmlLabelTagsArr = ['small', 'label'];
  var labelTextOptions = {
    "class": 'form-label'
  };
  var labelOptions = {
    "class": ['text-warning', 'mb-0']
  };
  var htmlLabelOptionsArr = [labelTextOptions, labelOptions];
  var elemOptions = {
    "class": ['form-control', 'mb-1', 'bg-secondary', 'text-white', 'text-right'],
    autofocus: 'autofocus',
    required: 'required',
    style: '',
    readonly: 'readonly'
  }; // ALWAYS SHOW
  // EXPENSE.TYPE - HTML SELECT
  // expense type INPUT OPTIONS

  labelOptions["for"] = "expenseType".concat(expense._id);
  elemOptions.id = "expenseType".concat(expense._id);
  elemOptions.name = 'expenseType';
  elemOptions.autocomplete = 'expenseType'; // expense type INPUT TAGS & OPTONS

  var htmlTagsArr = htmlLabelTagsArr.concat(['select']);
  htmlLabelOptionsArr[1] = labelOptions;
  var htmlOptionsArr = htmlLabelOptionsArr.concat([elemOptions]); // expense type INPUT ELEMENT

  var typeOptionElem = createSelectOptions(expenseTypes, expense.type);
  var typeElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Type', typeOptionElem]);
  var typeElemDiv = createElement('div', divElemOptions, typeElem);
  var typeElemRow = createElement('div', divRowOptions, typeElemDiv);
  delete elemOptions.autocomplete; // EXPENSE.DESCRIPTION - HTML INPUT text
  // expense description INPUT OPTIONS

  labelOptions["for"] = "expenseDescription".concat(expense._id);
  elemOptions.type = 'text';
  elemOptions.id = "expenseDescription".concat(expense._id);
  elemOptions.name = 'expenseDescription';
  elemOptions.autocomplete = 'expenseDescription';
  elemOptions.value = expense.description; // expense description INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  var descriptionClosingTags = [true, true, false]; // expense description INPUT ELEMENT

  var descriptionElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Description', ''], descriptionClosingTags);
  var descriptionElemDiv = createElement('div', divElemOptions, descriptionElem);
  var descriptionElemRow = createElement('div', divRowOptions, descriptionElemDiv);
  delete elemOptions.value;
  delete elemOptions.type; // EXPENSE.DATE - HTML INPUT date
  // expense date INPUT OPTIONS

  labelOptions["for"] = "invoiceDate".concat(expense._id);
  elemOptions.type = 'date';
  elemOptions.id = "invoiceDate".concat(expense._id);
  elemOptions.name = 'invoiceDate';
  elemOptions.autocomplete = 'invoiceDate';
  elemOptions.value = moment(expense.date).format('YYYY-MM-DD');
  elemOptions.min = moment(travel.dateFrom).format('YYYY-MM-DD');
  elemOptions.max = moment(travel.dateTo).format('YYYY-MM-DD'); // elemOptions.style =  elemOptions.style + '-webkit-text-fill-color: white;';
  // expense date INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  var dateClosingTags = [true, true, false]; // expense date INPUT ELEMENT

  var dateElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Date', ''], dateClosingTags);
  var dateElemDiv = createElement('div', divElemOptions, dateElem);
  var dateElemRow = createElement('div', divRowOptions, dateElemDiv);
  delete elemOptions.value;
  delete elemOptions.type;
  delete elemOptions.min;
  delete elemOptions.max; // elemOptions.style.replace('-webkit-text-fill-color: white;', '');
  // NOT MILEAGE
  // EXPENSE.CURRENCY - HTML INPUT text
  // expense currency INPUT OPTIONS

  labelOptions["for"] = "invoiceCurrency".concat(expense._id);
  elemOptions["class"].push('text-to-upper');
  elemOptions.type = 'text';
  elemOptions.id = "invoiceCurrency".concat(expense._id);
  elemOptions.list = "currencies".concat(expense._id);
  elemOptions.name = 'invoiceCurrency';
  elemOptions.autocomplete = 'invoiceCurrency';
  elemOptions.placeholder = 'USD';
  elemOptions.minLength = '3';
  elemOptions.maxlength = '3';
  elemOptions.value = !mileage ? expense.currency : '';
  elemOptions.required = !mileage ? 'required' : ''; // expense currency INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  var currencyClosingTags = [true, true, false];
  var currencyOptionElem = createSelectOptions(['USD', 'EUR', 'RSD', 'HRK', 'BAM'], elemOptions.value, {
    "class": 'currency'
  });
  var currencyDatalistElem = createElement('datalist', {
    "class": 'currencies',
    id: "currencies".concat(expense._id)
  }, currencyOptionElem);
  var currencyElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Currency', currencyDatalistElem], currencyClosingTags);
  var currencyElemDiv = createElement('div', divElemOptions, currencyElem);
  var currencyElemRow = createElement('div', divRowOptions, currencyElemDiv);
  elemOptions["class"].pop();
  delete elemOptions.placeholder;
  delete elemOptions.minLength;
  delete elemOptions.maxlength;
  delete elemOptions.value;
  elemOptions.required = 'required'; // EXPENSE.RATE - HTML INPUT number
  // expense rate INPUT OPTIONS

  labelOptions["for"] = "rate".concat(expense._id);
  elemOptions.type = 'number';
  elemOptions.id = "rate".concat(expense._id);
  elemOptions.name = 'rate';
  elemOptions.autocomplete = 'rate';
  elemOptions.step = '0.01';
  elemOptions.placeholder = '0.00';
  elemOptions.value = !mileage ? curRate.rate[expense.currency].toString() : '';
  elemOptions.min = 0; // divRowOptions.style = `display: ${(mileage) ? 'none' : 'initial'}`;
  // expense rate INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  var rateClosingTags = [true, true, false];
  var rateElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Rate', ''], rateClosingTags);
  var rateElemDiv = createElement('div', divElemOptions, rateElem);
  var rateElemRow = createElement('div', divRowOptions, rateElemDiv);
  delete elemOptions.placeholder;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.value; // delete divRowOptions.style;
  // EXPENSE.AMOUNT - HTML INPUT number
  // expense amount INPUT OPTIONS

  labelOptions["for"] = "amount".concat(expense._id);
  elemOptions.type = 'number';
  elemOptions.id = "amount".concat(expense._id);
  elemOptions.name = 'amount';
  elemOptions.autocomplete = 'amount';
  elemOptions.step = '0.01';
  elemOptions.placeholder = '0.00';
  elemOptions.value = !mileage ? Number(expense.amount).toFixed(2) : '';
  elemOptions.min = 0; // expense amount INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  var amountClosingTags = [true, true, false];
  var amountElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Amount', ''], amountClosingTags);
  var amountElemDiv = createElement('div', divElemOptions, amountElem);
  var amountElemRow = createElement('div', divRowOptions, amountElemDiv);
  delete elemOptions.placeholder;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.value; // EXPENSE.AMOUNTCONVERTED - HTML INPUT number
  // expense amountConverted INPUT OPTIONS

  labelOptions["for"] = "amountConverted".concat(expense._id);
  labelOptions["class"].push('input-group');
  elemOptions.type = 'number';
  elemOptions.id = "amountConverted".concat(expense._id);
  elemOptions.name = 'amountConverted';
  elemOptions.autocomplete = 'amountConverted';
  elemOptions.placeholder = '0.00';
  elemOptions.value = !mileage ? Number(expense.amountConverted).toFixed(2) : '';
  elemOptions.min = 0;
  elemOptions["class"].push('input-group');
  elemOptions.readonly = 'readonly';
  divElemOptions["class"] = ['input-group']; // expense amountConverted INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  var amountConvertedClosingTags = [true, true, false];
  var prependElemSpan = createElement('span', {
    "class": 'input-group-text mb-1 text-white bg-secondary',
    id: "currency-addon".concat(expense._id)
  }, travel.homeCurrency);
  var prependElemDiv = createElement('div', {
    "class": 'input-group-prepend'
  }, prependElemSpan);
  var amountConvertedElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Amount Converted', ''], amountConvertedClosingTags, prependElemDiv);
  var amountConvertedElemDiv = createElement('div', divElemOptions, amountConvertedElem);
  var amountConvertedElemRow = createElement('div', divRowOptions, amountConvertedElemDiv);
  delete elemOptions.placeholder;
  delete elemOptions.min;
  delete elemOptions.value;
  elemOptions["class"].pop();
  delete elemOptions.readonly;
  delete divElemOptions["class"];
  var notMileageDivOptions = {
    "class": '',
    id: "notMileage".concat(expense._id),
    style: "display: ".concat(mileage ? 'none' : 'initial')
  }; // MILEAGE

  var aDistanceId = "amountDistance".concat(expense._id);
  var aDistance2Id = "amountDistance2".concat(expense._id);
  var aDistanceRowId = "amountDistanceRow".concat(expense._id);
  var aDistanceRow2Id = "amountDistance2Row".concat(expense._id); // EXPENSE.UNIT - HTML SELECT

  labelOptions["for"] = "invoiceUnit".concat(expense._id);
  elemOptions.id = "invoiceUnit".concat(expense._id);
  elemOptions.name = 'invoiceUnit';
  elemOptions.autocomplete = 'invoiceUnit';
  elemOptions.onchange = 'invoiceUnitChange(event)'; // expense type INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'select';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions; // expense type INPUT ELEMENT

  var unitOptionElem = createSelectOptions(['mi', 'km'], expense.unit);
  var unitElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Unit', unitOptionElem]);
  var unitElemDiv = createElement('div', divElemOptions, unitElem);
  var unitElemRow = createElement('div', divRowOptions, unitElemDiv);
  delete elemOptions.autocomplete;
  delete elemOptions.onchange; // EXPENSE.PERMILEAMOUNT - HTML INPUT number

  labelOptions["for"] = "travelPerMileAmount".concat(expense._id);
  elemOptions.id = "travelPerMileAmount".concat(expense._id);
  elemOptions.name = 'travelPerMileAmount';
  elemOptions.autocomplete = 'travelPerMileAmount';
  elemOptions.type = 'number';
  elemOptions.value = mileage ? Number(travel.perMileAmount).toFixed(2) : '';
  elemOptions.step = '0.01';
  elemOptions.min = 0;
  elemOptions.placeholder = '0.00';
  elemOptions.readonly = 'readonly'; // expense type INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions; // expense type INPUT ELEMENT
  // TODO link userHomeDistance to user model

  var userHomeDistance = 'mi';
  var labelPerMileAmountText = "".concat(travel.homeCurrency, "/").concat(userHomeDistance);
  var perMileAmountElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [labelPerMileAmountText, '']);
  var perMileAmountElemDiv = createElement('div', divElemOptions, perMileAmountElem);
  var perMileAmountElemRow = createElement('div', divRowOptions, perMileAmountElemDiv);
  delete elemOptions.autocomplete;
  delete elemOptions.type;
  delete elemOptions.value;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.placeholder;
  delete elemOptions.readonly; // EXPENSE.AMOUNTDISTANCE - HTML INPUT number

  labelOptions["for"] = "amountDistance".concat(expense._id);
  elemOptions.id = "amountDistance".concat(expense._id);
  elemOptions.name = 'amountDistance';
  elemOptions.autocomplete = 'amountDistance';
  elemOptions.type = 'number';
  elemOptions.value = mileage ? Number(expense.amount).toFixed(2) : '';
  elemOptions.step = '0.01';
  elemOptions.min = 0;
  elemOptions.placeholder = '0.00';
  divRowOptions.id = aDistanceRowId; // expense type INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions; // expense type INPUT ELEMENT

  var labelAmountDistanceText = "Distance[".concat(userHomeDistance, "]");
  var amountDistanceElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [labelAmountDistanceText, '']);
  var amountDistanceElemDiv = createElement('div', divElemOptions, amountDistanceElem);
  var amountDistanceElemRow = createElement('div', divRowOptions, amountDistanceElemDiv);
  delete elemOptions.autocomplete;
  delete elemOptions.type;
  delete elemOptions.value;
  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.placeholder;
  delete divRowOptions.id; // EXPENSE.AMOUNTCONVERTED2 - HTML INPUT number
  // expense amountConverted2 INPUT OPTIONS

  labelOptions["for"] = "amountConverted2".concat(expense._id);
  labelOptions["class"].push('input-group');
  elemOptions.type = 'number';
  elemOptions.id = "amountConverted2".concat(expense._id);
  elemOptions.name = 'amountConverted2';
  elemOptions.autocomplete = 'amountConverted2';
  elemOptions.placeholder = '0.00';
  elemOptions.value = mileage ? Number(expense.amountConverted).toFixed(2) : '';
  elemOptions.min = 0;
  elemOptions["class"].push('input-group');
  elemOptions.readonly = 'readonly';
  divElemOptions["class"] = ['input-group']; // expense amountConverted INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions;
  var amountConverted2ClosingTags = [true, true, false];
  var prependElemSpan2 = createElement('span', {
    "class": 'input-group-text mb-1 text-white bg-secondary',
    id: "currency-addon2".concat(expense._id)
  }, travel.homeCurrency);
  var prependElemDiv2 = createElement('div', {
    "class": 'input-group-prepend'
  }, prependElemSpan2);
  var amountConverted2Elem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Amount Converted', ''], amountConverted2ClosingTags, prependElemDiv2);
  var amountConverted2ElemDiv = createElement('div', divElemOptions, amountConverted2Elem);
  var amountConverted2ElemRow = createElement('div', divRowOptions, amountConverted2ElemDiv);
  delete elemOptions.placeholder;
  delete elemOptions.min;
  delete elemOptions.value;
  elemOptions["class"].pop();
  delete elemOptions.readonly;
  delete divElemOptions["class"]; // EXPENSE.AMOUNTDISTANCE2 - HTML INPUT number

  var userHomeDistance2 = userHomeDistance === 'mi' ? 'km' : 'mi';
  labelOptions["for"] = "amountDistance2".concat(expense._id);
  elemOptions.id = "amountDistance2".concat(expense._id);
  elemOptions.name = 'amountDistance2';
  elemOptions.autocomplete = 'amountDistance2';
  elemOptions.type = 'number'; // elemOptions.value = (mileage) ? Number(expense.amount).toFixed(2) : '';

  elemOptions.step = '0.01';
  elemOptions.min = 0;
  elemOptions.placeholder = '0.00';
  elemOptions.readonly = 'readonly';
  divRowOptions.style = divRowOptions.style + 'display: none;';
  divRowOptions.id = aDistanceRow2Id; // expense type INPUT TAGS & OPTONS

  htmlTagsArr[2] = 'input';
  htmlLabelOptionsArr[1] = labelOptions;
  htmlOptionsArr[2] = elemOptions; // expense type INPUT ELEMENT

  var labelAmountDistance2Text = "Distance[".concat(userHomeDistance2, "]");
  var amountDistance2Elem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [labelAmountDistance2Text, '']);
  var amountDistance2ElemDiv = createElement('div', divElemOptions, amountDistance2Elem);
  var amountDistance2ElemRow = createElement('div', divRowOptions, amountDistance2ElemDiv);
  delete elemOptions.autocomplete;
  delete elemOptions.type; // delete elemOptions.value;

  delete elemOptions.step;
  delete elemOptions.min;
  delete elemOptions.placeholder;
  delete elemOptions.readonly;
  divRowOptions.style.replace('display: none;', '');
  delete divRowOptions.id;
  var expenseButtonEditOptions = {
    "class": ['badge', 'badge-secondary', 'text-white'],
    type: 'button',
    onclick: "editExpense(event)"
  };
  var expenseButtonElemOptions = {
    "class": 'mb-0 d-inline mx-1'
  };
  var expenseButtonEditText = createElement('button', expenseButtonEditOptions, 'edit');
  var expenseButtonEditElem = createElement('h6', expenseButtonElemOptions, expenseButtonEditText);
  var mileageDivOptions = {
    "class": '',
    id: "mileage".concat(expense._id),
    style: "display: ".concat(mileage ? 'initial' : 'none')
  };
  var formOptions = {
    action: "/travels/".concat(travel._id, "/expenses/").concat(expense._id),
    method: method,
    id: "expenseForm".concat(expense._id)
  };
  var hiddenInput = createElement('input', hiddenInputOptions, '', false);
  var alwaysShowElem = typeElemRow + descriptionElemRow + dateElemRow;
  var formAlwaysShowDiv = createElement('div', {
    "class": '',
    id: "alwaysShow".concat(expense._id)
  }, alwaysShowElem);
  var formNotMIleageElem = currencyElemRow + rateElemRow + amountElemRow + amountConvertedElemRow;
  var formNotMileageDiv = createElement('div', notMileageDivOptions, formNotMIleageElem);
  var formMileageElem = unitElemRow + perMileAmountElemRow + amountDistanceElemRow + amountDistance2ElemRow + amountConverted2ElemRow;
  var formMileageDiv = createElement('div', mileageDivOptions, formMileageElem);
  var formElements = hiddenInput + formAlwaysShowDiv + formNotMileageDiv + formMileageDiv + expenseButtonEditElem;
  var form = createElement('form', formOptions, formElements);
  return form;
};
/*
 * Returns HTML elements
 * @param {object} value Array with travels mongo aggregate group by year and each year group by month
 * more in Travel Schema /models/Travel.js Travel.byYear_byMonth
 */


expressHbs.registerHelper('yearsAccordionWithForm', function (value, csrf) {
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }); // HTML Accordion - RESULT

  var yearObjectsArray = [];
  value.forEach(function (yearObject) {
    var yearString = yearObject._id.year.toString(); // HTML Year Card COLLAPSE - BODY


    var monthObjectsArray = [];
    yearObject.byYear.forEach(function (monthObject) {
      var monthValue = monthObject._id.month - 1;
      var monthString = moment().month(monthValue).format('MMMM');
      var travelObjectsArray = []; // HTML Month Card COLLAPSE - BODY

      monthObject.byMonth.forEach(function (travelObject) {
        var dateFromString = moment(travelObject.dateFrom).format('YYYY-MM-DD');
        var travelId = travelObject._id;
        var expensesCount = travelObject.expenses.length;
        var hrefTravel = "/travels/".concat(travelId);
        var homeCurrency = travelObject.homeCurrency;
        var totalString = "".concat(formatter.format(travelObject.total), " ").concat(homeCurrency);
        var travelHeaderTextString = "".concat(dateFromString, " ").concat(travelObject.description, " ").concat(totalString); // HTML Travel Card COLLAPSE - BODY

        var expenseObjectsArray = [];
        travelObject.expenses.forEach(function (expenseObject) {
          var expenseId = expenseObject._id;
          var expenseCardBodyOptions = {
            "class": 'card-body',
            id: "heading".concat(expenseId, "_CardBody")
          };
          var expenseCardOptions = {
            "class": ['card', 'text-white', 'bg-secondary', 'mx-2', 'my-2', 'border-warning'],
            id: "expense_".concat(expenseId, "_Card")
          };
          var form = createExpenseForm('post', 'patch', csrf, expenseTypes, travelObject, expenseObject, formatter);
          var expenseCardBody = createElement('div', expenseCardBodyOptions, form);
          var expenseCard = createElement('div', expenseCardOptions, expenseCardBody);
          expenseObjectsArray.push(expenseCard);
        });
        var expenses = expenseObjectsArray.join(''); // HTML Travel Card ELEMENTS OPTIONS

        var travelButtonBadgeOptions = {
          "class": 'badge badge-warning mx-1'
        };
        /*
         * travelButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
         * if else statement where checks class.indexOf(class)
         */

        var travelButtonShowOptions = {
          "class": ['badge', 'badge-secondary', 'text-warning'],
          type: 'button',
          data_toggle: 'collapse',
          data_target: "#collapse".concat(travelId),
          aria_expanded: 'true',
          aria_controls: "collapse".concat(travelId),
          data_text_swap: 'hide',
          data_text_original: 'show',
          data_text_badge: "".concat(expensesCount),
          data_text_badge_sr: 'expenses count in travel',
          onclick: 'toggleTravelButtonText(event)',
          style: 'width: 70px'
        };
        var travelButtonEditOptions = {
          "class": ['badge', 'badge-secondary', 'text-white'],
          type: 'button',
          onclick: "location.href='".concat(hrefTravel, "'")
        };
        var travelButtonElemOptions = {
          "class": 'mb-0 d-inline mx-1'
        };
        var travelHeaderTextOptions = {
          "class": 'mb-1'
        };
        var travelCollapseOptions = {
          id: "collapse".concat(travelId),
          "class": 'collapse',
          aria_labelledby: "heading".concat(travelId, "_CardHeader") // data_parent: `#travel_${travelId}Accordion`

        };
        var travelCardOptions = {
          "class": 'card  bg-secondary text-white',
          id: "travel_".concat(travelId, "_Card")
        }; // HTML Travel ELEMENTS

        var travelButtonBadgeSr = createElement('span', {
          "class": 'sr-only'
        }, 'expenses count');
        var travelButtonBadge = createElement('span', travelButtonBadgeOptions, expensesCount);
        var travelButtonShowText = createElement('button', travelButtonShowOptions, 'show' + travelButtonBadge + travelButtonBadgeSr);
        var travelButtonShowElem = createElement('h6', travelButtonElemOptions, travelButtonShowText);
        var travelButtonEditText = createElement('button', travelButtonEditOptions, 'edit');
        var travelButtonEditElem = createElement('h6', travelButtonElemOptions, travelButtonEditText);
        var travelHeaderText = createElement('h6', travelHeaderTextOptions, travelHeaderTextString);
        var travelHeaderElem = createElement('div', {
          "class": ''
        }, travelHeaderText + travelButtonShowElem + travelButtonEditElem);
        var travelCardHeader = createElement('div', {
          "class": 'card-header py-2'
        }, travelHeaderElem);
        var travelCardBody = createElement('div', {
          "class": 'card-body'
        }, expenses);
        var travelCollapse = createElement('div', travelCollapseOptions, travelCardBody);
        var travelCard = createElement('div', travelCardOptions, travelCardHeader + travelCollapse);
        travelObjectsArray.push(travelCard);
      });
      var travels = travelObjectsArray.join(""); // HTML Month ELEMENTS OPTIONS

      var monthButtonBadgeOptions = {
        "class": 'badge badge-dark mx-1'
      };
      /*
       * monthButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
       * if else statement where checks class.indexOf(class)
       */

      var monthButtonShowOptions = {
        "class": ['badge', 'badge-light', 'text-dark'],
        type: 'button',
        data_toggle: 'collapse',
        data_target: "#collapse".concat(yearString, "_").concat(monthValue),
        aria_expanded: 'true',
        aria_controls: "collapse".concat(yearString, "_").concat(monthValue),
        data_text_swap: 'hide',
        data_text_original: 'show',
        data_text_badge: "".concat(monthObject.count),
        data_text_badge_sr: 'travels count in month',
        onclick: 'toggleTravelButtonText(event)',
        style: 'width: 70px'
      };
      var monthCollapseOptions = {
        id: "collapse".concat(yearString, "_").concat(monthValue),
        "class": 'collapse',
        aria_labelledby: "heading".concat(yearString, "_").concat(monthValue, "_CardHeader")
      }; // HTML Month ELEMENTS

      var monthButtonBadgeSr = createElement('span', {
        "class": 'sr-only'
      }, 'expenses count');
      var monthButtonBadge = createElement('span', monthButtonBadgeOptions, monthObject.count);
      var monthButtonShowText = createElement('button', monthButtonShowOptions, 'show' + monthButtonBadge + monthButtonBadgeSr);
      var monthButtonShowElem = createElement('h6', {
        "class": 'mb-0 mx-1 d-inline float-right'
      }, monthButtonShowText);
      var monthCardHeader = createElement('div', {
        "class": 'card-header py-2'
      }, monthString + monthButtonShowElem);
      var monthCardBody = createElement('div', {
        "class": 'card-body'
      }, travels);
      var monthCollapse = createElement('div', monthCollapseOptions, monthCardBody);
      var monthCard = createElement('div', {
        "class": 'card',
        style: 'border: none'
      }, monthCardHeader + monthCollapse);
      monthObjectsArray.push(monthCard);
    });
    var months = monthObjectsArray.join(''); // HTML Year ELEMENTS OPTIONS

    var yearButtonBadgeOptions = {
      "class": 'badge badge-light mx-1'
    };
    /*
     * yearlButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
     * if else statement where checks class.indexOf(class)
     */

    var yearButtonShowOptions = {
      "class": ['badge', 'badge-dark', 'text-white'],
      type: 'button',
      data_toggle: 'collapse',
      data_target: "#collapse".concat(yearString),
      aria_expanded: 'false',
      aria_controls: "collapse".concat(yearString),
      data_text_swap: 'hide',
      data_text_original: 'show',
      data_text_badge: "".concat(yearObject.countTotal),
      data_text_badge_sr: 'travels count in month',
      onclick: 'toggleTravelButtonText(event)',
      style: 'width: 70px'
    };
    var monthsCollapseOptions = {
      id: "collapse".concat(yearString),
      "class": 'collapse',
      aria_labelledby: "heading".concat(yearString, "_CardHeader")
    }; // HTML Year ELEMENTS

    var yearButtonBadgeSr = createElement('span', {
      "class": 'sr-only'
    }, 'expenses count');
    var yearButtonBadge = createElement('span', yearButtonBadgeOptions, yearObject.countTotal);
    var yearButtonShowText = createElement('button', yearButtonShowOptions, 'show' + yearButtonBadge + yearButtonBadgeSr);
    var yearButtonShowElem = createElement('h6', {
      "class": 'mb-0 mx-1 d-inline float-right'
    }, yearButtonShowText);
    var yearCardHeader = createElement('div', {
      "class": 'card-header py-2',
      id: "heading".concat(yearString, "_CardHeader")
    }, yearString + yearButtonShowElem);
    var yearCardBody = createElement('div', {
      "class": 'card-body p-0'
    }, months);
    var yearCollapse = createElement('div', monthsCollapseOptions, yearCardBody);
    var yearCard = createElement('div', {
      "class": 'card'
    }, yearCardHeader + yearCollapse);
    yearObjectsArray.push(yearCard);
  });
  var result = createElement('div', {
    id: 'yearsAccordion'
  }, yearObjectsArray.join('\n'));
  return result;
});
/*
 * Returns HTML elements
 * @param {object} value Array with travels mongo aggregate group by year and each year group by month
 * more in Travel Schema /models/Travel.js Travel.byYear_byMonth
 */

expressHbs.registerHelper('yearsAccordion', function (value, csrf) {
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }); // HTML Accordion - RESULT

  var yearObjectsArray = [];
  value.forEach(function (yearObject) {
    var yearString = yearObject._id.year.toString(); // HTML Year Card COLLAPSE - BODY


    var monthObjectsArray = [];
    yearObject.byYear.forEach(function (monthObject) {
      var monthValue = monthObject._id.month - 1;
      var monthString = moment().month(monthValue).format('MMMM');
      var travelObjectsArray = []; // HTML Month Card COLLAPSE - BODY

      monthObject.byMonth.forEach(function (travelObject) {
        var dateFromString = moment(travelObject.dateFrom).format('YYYY-MM-DD');
        var travelId = travelObject._id;
        var expensesCount = travelObject.expenses.length;
        var hrefTravel = "/travels/".concat(travelId);
        var homeCurrency = travelObject.homeCurrency;
        var totalString = "".concat(formatter.format(travelObject.total), " ").concat(homeCurrency);
        var travelHeaderTextString = "".concat(dateFromString, " ").concat(travelObject.description, " ").concat(totalString); // HTML Travel Card COLLAPSE - BODY

        var expenseObjectsArray = [];
        travelObject.expenses.forEach(function (expenseObject) {
          var expenseId = expenseObject._id;
          var expenseDate = expenseObject.date;
          var expenseDateString = moment(expenseDate).format('YYYY-MM-DD');
          var amountString = formatter.format(expenseObject.amount);
          var amountConvertedString = formatter.format(expenseObject.amountConverted); // Different data if expenseObject.type = Mileage

          var currency_unit, rate, rateText, amountLabelText;

          if (expenseObject.type != 'Mileage') {
            currency_unit = expenseObject.currency;
            var curRate = travelObject.curRates.find(function (exp) {
              return exp._id.toString() === expenseObject.curRate.toString();
            });

            if (curRate) {
              rate = formatter.format(curRate.rate[expenseObject.currency]);
            } else {
              rate = formatter.format(0);
            }

            rateText = "1 ".concat(travelObject.homeCurrency, " = ").concat(rate, " ").concat(currency_unit);
            amountLabelText = 'Amount in local currency';
          } else {
            currency_unit = expenseObject.unit;
            rate = formatter.format(Number(travelObject.perMileAmount));
            rateText = "1 ".concat(currency_unit, " = ").concat(rate, " ").concat(travelObject.homeCurrency);
            amountLabelText = 'Distance';
          } // HTML Expense Card ELEMENTS OPTIONS


          var labelTextOptions = {
            "class": 'card-text'
          };
          var labelOptions = {
            "class": 'card-text text-warning mb-0'
          };
          var expenseOptions = {
            "class": 'card-text mb-1'
          }; // TODO titleOptions, expenseCardBodyOptions & expenseCard id not needed?

          var titleOptions = {
            "class": 'card-title',
            id: "heading".concat(expenseId, "_CardTitle")
          };
          var expenseCardBodyOptions = {
            "class": 'card-body',
            id: "heading".concat(expenseId, "_CardBody")
          };
          var expenseCardOptions = {
            "class": ['card', 'text-white', 'bg-secondary', 'mx-2', 'my-2', 'border-warning'],
            id: "expense_".concat(expenseId, "_Card")
          }; // Card Body tags and attributes for expenseObject values

          var htmlLabelTagsArr = ['small', 'p'];
          var htmlTagsArr = htmlLabelTagsArr.concat(['p']);
          var htmlOptionsArr = [labelTextOptions, labelOptions, expenseOptions];
          var htmlTagsArrTitle = htmlLabelTagsArr.concat(['h6']);
          var htmlOptionsArrTitle = [labelTextOptions, labelOptions, titleOptions]; // HTML Expense Card ELEMENTS

          var expenseDescriptionElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Description', expenseObject.description]);
          var expenseDateElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Date', expenseDateString]);
          var expenseRateElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Rate', rateText]);
          var aText = amountString + ' ' + currency_unit;
          var expenseAmountElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, [amountLabelText, aText]);
          var acText = amountConvertedString + ' ' + travelObject.homeCurrency;
          var expenseAmountConvertedElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Amount', acText]);
          var expenseTypeElem = createTwoCardElements(htmlTagsArr, htmlOptionsArr, ['Type', expenseObject.type]);
          var expenseCardBodyTitle = expenseTypeElem; // const expenseCardBodyTitle = createElement('h6', titleOptions, expenseObject.type);

          var expenseBodyElements = expenseCardBodyTitle + expenseDateElem + expenseDescriptionElem + expenseAmountElem + expenseRateElem + expenseAmountConvertedElem; // test

          var form = createExpenseForm('post', 'patch', csrf, expenseTypes, travelObject, expenseObject, formatter);
          var expenseCardBody = createElement('div', expenseCardBodyOptions, form + expenseBodyElements); // const expenseCardBody = createElement('div', expenseCardBodyOptions, expenseBodyElements);

          var expenseCard = createElement('div', expenseCardOptions, expenseCardBody);
          expenseObjectsArray.push(expenseCard);
        });
        var expenses = expenseObjectsArray.join(''); // HTML Travel Card ELEMENTS OPTIONS

        var travelButtonBadgeOptions = {
          "class": 'badge badge-warning mx-1'
        };
        /*
         * travelButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
         * if else statement where checks class.indexOf(class)
         */

        var travelButtonShowOptions = {
          "class": ['badge', 'badge-secondary', 'text-warning'],
          type: 'button',
          data_toggle: 'collapse',
          data_target: "#collapse".concat(travelId),
          aria_expanded: 'true',
          aria_controls: "collapse".concat(travelId),
          data_text_swap: 'hide',
          data_text_original: 'show',
          data_text_badge: "".concat(expensesCount),
          data_text_badge_sr: 'expenses count in travel',
          onclick: 'toggleTravelButtonText(event)',
          style: 'width: 70px'
        };
        var travelButtonEditOptions = {
          "class": ['badge', 'badge-secondary', 'text-white'],
          type: 'button',
          onclick: "location.href='".concat(hrefTravel, "'")
        };
        var travelButtonElemOptions = {
          "class": 'mb-0 d-inline mx-1'
        };
        var travelHeaderTextOptions = {
          "class": 'mb-1'
        };
        var travelCollapseOptions = {
          id: "collapse".concat(travelId),
          "class": 'collapse',
          aria_labelledby: "heading".concat(travelId, "_CardHeader") // data_parent: `#travel_${travelId}Accordion`

        };
        var travelCardOptions = {
          "class": 'card  bg-secondary text-white',
          id: "travel_".concat(travelId, "_Card")
        }; // HTML Travel ELEMENTS

        var travelButtonBadgeSr = createElement('span', {
          "class": 'sr-only'
        }, 'expenses count');
        var travelButtonBadge = createElement('span', travelButtonBadgeOptions, expensesCount);
        var travelButtonShowText = createElement('button', travelButtonShowOptions, 'show' + travelButtonBadge + travelButtonBadgeSr);
        var travelButtonShowElem = createElement('h6', travelButtonElemOptions, travelButtonShowText);
        var travelButtonEditText = createElement('button', travelButtonEditOptions, 'edit');
        var travelButtonEditElem = createElement('h6', travelButtonElemOptions, travelButtonEditText);
        var travelHeaderText = createElement('h6', travelHeaderTextOptions, travelHeaderTextString);
        var travelHeaderElem = createElement('div', {
          "class": ''
        }, travelHeaderText + travelButtonShowElem + travelButtonEditElem);
        var travelCardHeader = createElement('div', {
          "class": 'card-header py-2'
        }, travelHeaderElem);
        var travelCardBody = createElement('div', {
          "class": 'card-body'
        }, expenses);
        var travelCollapse = createElement('div', travelCollapseOptions, travelCardBody);
        var travelCard = createElement('div', travelCardOptions, travelCardHeader + travelCollapse);
        travelObjectsArray.push(travelCard);
      });
      var travels = travelObjectsArray.join(""); // HTML Month ELEMENTS OPTIONS

      var monthButtonBadgeOptions = {
        "class": 'badge badge-dark mx-1'
      };
      /*
       * monthButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
       * if else statement where checks class.indexOf(class)
       */

      var monthButtonShowOptions = {
        "class": ['badge', 'badge-light', 'text-dark'],
        type: 'button',
        data_toggle: 'collapse',
        data_target: "#collapse".concat(yearString, "_").concat(monthValue),
        aria_expanded: 'true',
        aria_controls: "collapse".concat(yearString, "_").concat(monthValue),
        data_text_swap: 'hide',
        data_text_original: 'show',
        data_text_badge: "".concat(monthObject.count),
        data_text_badge_sr: 'travels count in month',
        onclick: 'toggleTravelButtonText(event)',
        style: 'width: 70px'
      };
      var monthCollapseOptions = {
        id: "collapse".concat(yearString, "_").concat(monthValue),
        "class": 'collapse',
        aria_labelledby: "heading".concat(yearString, "_").concat(monthValue, "_CardHeader")
      }; // HTML Month ELEMENTS

      var monthButtonBadgeSr = createElement('span', {
        "class": 'sr-only'
      }, 'expenses count');
      var monthButtonBadge = createElement('span', monthButtonBadgeOptions, monthObject.count);
      var monthButtonShowText = createElement('button', monthButtonShowOptions, 'show' + monthButtonBadge + monthButtonBadgeSr);
      var monthButtonShowElem = createElement('h6', {
        "class": 'mb-0 mx-1 d-inline float-right'
      }, monthButtonShowText);
      var monthCardHeader = createElement('div', {
        "class": 'card-header py-2'
      }, monthString + monthButtonShowElem);
      var monthCardBody = createElement('div', {
        "class": 'card-body'
      }, travels);
      var monthCollapse = createElement('div', monthCollapseOptions, monthCardBody);
      var monthCard = createElement('div', {
        "class": 'card',
        style: 'border: none'
      }, monthCardHeader + monthCollapse);
      monthObjectsArray.push(monthCard);
    });
    var months = monthObjectsArray.join(''); // HTML Year ELEMENTS OPTIONS

    var yearButtonBadgeOptions = {
      "class": 'badge badge-light mx-1'
    };
    /*
     * yearlButtonShowOptions's class badge-secondary is related to toggleTravelButtonText() in home.hbs
     * if else statement where checks class.indexOf(class)
     */

    var yearButtonShowOptions = {
      "class": ['badge', 'badge-dark', 'text-white'],
      type: 'button',
      data_toggle: 'collapse',
      data_target: "#collapse".concat(yearString),
      aria_expanded: 'false',
      aria_controls: "collapse".concat(yearString),
      data_text_swap: 'hide',
      data_text_original: 'show',
      data_text_badge: "".concat(yearObject.countTotal),
      data_text_badge_sr: 'travels count in month',
      onclick: 'toggleTravelButtonText(event)',
      style: 'width: 70px'
    };
    var monthsCollapseOptions = {
      id: "collapse".concat(yearString),
      "class": 'collapse',
      aria_labelledby: "heading".concat(yearString, "_CardHeader")
    }; // HTML Year ELEMENTS

    var yearButtonBadgeSr = createElement('span', {
      "class": 'sr-only'
    }, 'expenses count');
    var yearButtonBadge = createElement('span', yearButtonBadgeOptions, yearObject.countTotal);
    var yearButtonShowText = createElement('button', yearButtonShowOptions, 'show' + yearButtonBadge + yearButtonBadgeSr);
    var yearButtonShowElem = createElement('h6', {
      "class": 'mb-0 mx-1 d-inline float-right'
    }, yearButtonShowText);
    var yearCardHeader = createElement('div', {
      "class": 'card-header py-2',
      id: "heading".concat(yearString, "_CardHeader")
    }, yearString + yearButtonShowElem);
    var yearCardBody = createElement('div', {
      "class": 'card-body p-0'
    }, months);
    var yearCollapse = createElement('div', monthsCollapseOptions, yearCardBody);
    var yearCard = createElement('div', {
      "class": 'card'
    }, yearCardHeader + yearCollapse);
    yearObjectsArray.push(yearCard);
  });
  var result = createElement('div', {
    id: 'yearsAccordion'
  }, yearObjectsArray.join('\n'));
  return result;
});

/***/ }),

/***/ "./utils/myErrors.js":
/*!***************************!*\
  !*** ./utils/myErrors.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/* eslint-disable max-classes-per-file */
var importFileError =
/*#__PURE__*/
function (_Error) {
  _inherits(importFileError, _Error);

  function importFileError() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, importFileError);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(importFileError)).call.apply(_getPrototypeOf2, [this].concat(args)));
    Error.captureStackTrace(_assertThisInitialized(_this), importFileError);
    _this.name = 'importFileError';
    return _this;
  }

  return importFileError;
}(_wrapNativeSuper(Error));

var saveToDbError =
/*#__PURE__*/
function (_Error2) {
  _inherits(saveToDbError, _Error2);

  function saveToDbError() {
    var _getPrototypeOf3;

    var _this2;

    _classCallCheck(this, saveToDbError);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(saveToDbError)).call.apply(_getPrototypeOf3, [this].concat(args)));
    Error.captureStackTrace(_assertThisInitialized(_this2), saveToDbError);
    _this2.name = 'saveToDbError';
    return _this2;
  }

  return saveToDbError;
}(_wrapNativeSuper(Error));

exports.importFileError = importFileError;
exports.saveToDbError = saveToDbError;

/***/ }),

/***/ "./utils/postImport.js":
/*!*****************************!*\
  !*** ./utils/postImport.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _ = __webpack_require__(/*! lodash */ "lodash"); // const moment = require('moment');


var fs = __webpack_require__(/*! fs */ "fs");

var Papa = __webpack_require__(/*! papaparse */ "papaparse");

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");

var Travel = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js");

var Expense = __webpack_require__(/*! ../models/Expense */ "./models/Expense.js"); // const Rate = require('../models/Rate');


var Currency = __webpack_require__(/*! ../models/Currency */ "./models/Currency.js");

var ObjectId = mongoose.Types.ObjectId;

var _require = __webpack_require__(/*! ../lib/globals */ "./lib/globals.js"),
    expenseTypes = _require.expenseTypes;

var constants = __webpack_require__(/*! ../lib/constants */ "./lib/constants.js");

var myErrors = __webpack_require__(/*! ../utils/myErrors */ "./utils/myErrors.js"); // read and parse file


function readAndParseFile(filePath) {
  var enc,
      myFile,
      parsedData,
      _args = arguments;
  return regeneratorRuntime.async(function readAndParseFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          enc = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'utf8';
          _context.prev = 1;
          myFile = fs.readFileSync(filePath, enc);
          parsedData = Papa.parse(myFile, {
            quoteChar: '"',
            escapeChar: '"',
            header: true,
            dynamicTyping: false,
            preview: 0,
            encoding: 'utf8',
            complete: function complete(results) {},
            skipEmptyLines: true
          });
          return _context.abrupt("return", parsedData);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          throw _context.t0;

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
} // delete uploaded file


function deleteFile(filePath) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  try {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, function (err) {
        if (err) {
          throw err;
        }

        console.log(message);
      });
    }
  } catch (err) {
    console.log("File: ".concat(filePath, " not deleted!"));
    throw err;
  }
} // return Error with message on condtion is true


function checkFileFor(condition, message) {
  var suffix;
  return regeneratorRuntime.async(function checkFileFor$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          suffix = 'File should be a CSV with header in first line and not empty!';
          _context2.prev = 1;

          if (!condition) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", new myErrors.importFileError("".concat(message, " - ").concat(suffix)));

        case 4:
          _context2.next = 9;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](1);
          throw _context2.t0;

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 6]]);
} // check if file is not empty, CSV or it was not selected


var checkFile = function checkFile(myFile) {
  return new Promise(function _callee(resolve, reject) {
    var tripleCheck, result;
    return regeneratorRuntime.async(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            tripleCheck = function tripleCheck(myFIle) {
              return regeneratorRuntime.async(function tripleCheck$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.prev = 0;
                      _context3.next = 3;
                      return regeneratorRuntime.awrap(checkFileFor(myFile.name === '', 'No file selected!'));

                    case 3:
                      error = _context3.sent;

                      if (!error) {
                        _context3.next = 6;
                        break;
                      }

                      return _context3.abrupt("return", error);

                    case 6:
                      _context3.next = 8;
                      return regeneratorRuntime.awrap(checkFileFor(myFile.size === 0, 'Empty file!'));

                    case 8:
                      error = _context3.sent;

                      if (!error) {
                        _context3.next = 11;
                        break;
                      }

                      return _context3.abrupt("return", error);

                    case 11:
                      _context3.next = 13;
                      return regeneratorRuntime.awrap(checkFileFor(myFile.path.split('.').pop() != 'csv', 'Not a CSV file!'));

                    case 13:
                      error = _context3.sent;

                      if (!error) {
                        _context3.next = 16;
                        break;
                      }

                      return _context3.abrupt("return", error);

                    case 16:
                      return _context3.abrupt("return");

                    case 19:
                      _context3.prev = 19;
                      _context3.t0 = _context3["catch"](0);
                      resolve(_context3.t0);

                    case 22:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, null, null, [[0, 19]]);
            };

            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap(tripleCheck());

          case 4:
            result = _context4.sent;
            resolve(result);
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            resolve(_context4.t0);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 8]]);
  });
}; // create currency Object


function createCurrency(value) {
  var currency = {};
  var curRate = {};
  currency.base = value.base;
  currency.date = new Date(value.date);
  curRate[value.currency] = Number(value.rate);
  currency.rate = curRate;
  return currency;
} // return currency if currency does't exist in DB


var getOnlyNewCurrency = function getOnlyNewCurrency(currency, value) {
  return new Promise(function (resolve, reject) {
    if (!currency) {
      return resolve(value);
    }

    return resolve();
  });
};
/* Prepare new currencies which will save later.
 * Check if currencies are only in DB and return array with new currencies
 */


function expensesImportNewCurrenciesForSave(array) {
  var notExistingCurrenciesDB, existingCurrenciesDB;
  return regeneratorRuntime.async(function expensesImportNewCurrenciesForSave$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          notExistingCurrenciesDB = [];
          existingCurrenciesDB = [];
          _context7.next = 4;
          return regeneratorRuntime.awrap(new Promise(function _callee2(resolve, reject) {
            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

            return regeneratorRuntime.async(function _callee2$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context6.prev = 3;

                    _loop = function _loop() {
                      var currency;
                      return regeneratorRuntime.async(function _loop$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              value = _step.value;
                              _context5.next = 3;
                              return regeneratorRuntime.awrap(Currency.findOne({
                                base: value.base,
                                date: value.date,
                                rate: value.rate
                              }, function (err, doc) {
                                if (err) {
                                  console.log('Error: ', err.message);
                                  throw err;
                                }
                              }));

                            case 3:
                              currency = _context5.sent;
                              _context5.next = 6;
                              return regeneratorRuntime.awrap(getOnlyNewCurrency(currency, value).then(function (value) {
                                if (value) {
                                  notExistingCurrenciesDB.push(value);
                                } else {
                                  existingCurrenciesDB.push(currency);
                                }
                              })["catch"](function (err) {
                                reject(err);
                              }));

                            case 6:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      });
                    };

                    _iterator = array[Symbol.iterator]();

                  case 6:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context6.next = 12;
                      break;
                    }

                    _context6.next = 9;
                    return regeneratorRuntime.awrap(_loop());

                  case 9:
                    _iteratorNormalCompletion = true;
                    _context6.next = 6;
                    break;

                  case 12:
                    _context6.next = 18;
                    break;

                  case 14:
                    _context6.prev = 14;
                    _context6.t0 = _context6["catch"](3);
                    _didIteratorError = true;
                    _iteratorError = _context6.t0;

                  case 18:
                    _context6.prev = 18;
                    _context6.prev = 19;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 21:
                    _context6.prev = 21;

                    if (!_didIteratorError) {
                      _context6.next = 24;
                      break;
                    }

                    throw _iteratorError;

                  case 24:
                    return _context6.finish(21);

                  case 25:
                    return _context6.finish(18);

                  case 26:
                    _context6.next = 28;
                    return regeneratorRuntime.awrap(resolve({
                      notExistingCurrenciesDB: notExistingCurrenciesDB,
                      existingCurrenciesDB: existingCurrenciesDB
                    }));

                  case 28:
                    return _context6.abrupt("return", _context6.sent);

                  case 29:
                  case "end":
                    return _context6.stop();
                }
              }
            }, null, null, [[3, 14, 18, 26], [19,, 21, 25]]);
          }));

        case 4:
          return _context7.abrupt("return", _context7.sent);

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
}
/* read file, check file and return data or error
 * if file is not validate return custom error importFileError otherwise
 * return array with expenses data
 */


function readCheckFileAndGetData(myFile, option) {
  var error, myFilePath, headerToBe, parsedData, dataArray, expensesCountBefore, parsedHeaderArray;
  return regeneratorRuntime.async(function readCheckFileAndGetData$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          error = null;
          myFilePath = myFile.path;
          _context8.t0 = option;
          _context8.next = _context8.t0 === 'travels' ? 5 : _context8.t0 === 'expenses' ? 7 : 8;
          break;

        case 5:
          headerToBe = constants.IMPORT_TRAVEL_HEADER;
          return _context8.abrupt("break", 8);

        case 7:
          headerToBe = constants.IMPORT_EXPENSE_HEADER;

        case 8:
          _context8.prev = 8;
          _context8.next = 11;
          return regeneratorRuntime.awrap(checkFile(myFile)["catch"](function (err) {
            throw err;
          }));

        case 11:
          error = _context8.sent;

          if (!error) {
            _context8.next = 14;
            break;
          }

          throw error;

        case 14:
          _context8.next = 16;
          return regeneratorRuntime.awrap(readAndParseFile(myFilePath));

        case 16:
          parsedData = _context8.sent;
          dataArray = parsedData.data;
          expensesCountBefore = dataArray.length; // check if data has mathcing header

          parsedHeaderArray = parsedData.meta.fields;
          _context8.next = 22;
          return regeneratorRuntime.awrap(checkFileFor(!_.isEqual(headerToBe, parsedHeaderArray), "Header should be: ".concat(headerToBe))["catch"](function (err) {
            throw err;
          }));

        case 22:
          error = _context8.sent;

          if (!error) {
            _context8.next = 25;
            break;
          }

          throw error;

        case 25:
          return _context8.abrupt("return", dataArray);

        case 28:
          _context8.prev = 28;
          _context8.t1 = _context8["catch"](8);
          return _context8.abrupt("return", _context8.t1);

        case 31:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[8, 28]]);
}
/* Get and prepare currencies from imported file
 * remove rate & base from passed array @param dataArray
 * add property _user to passed array @param dataArray
 * add property curRate to passed array @param dataArray
 */


function expensesImportSetCurrencyArray(dataArray, userId, travels) {
  var message, error, expensesCountBefore, noTravelKeys, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, currenciesArray, expensesCountAfter, invalidExpensesCount, validExpensesCount;

  return regeneratorRuntime.async(function expensesImportSetCurrencyArray$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          message = '';
          error = null;
          _context10.prev = 2;
          expensesCountBefore = dataArray.length; // findRates and travel in expenses CSV

          noTravelKeys = [];
          _context10.next = 7;
          return regeneratorRuntime.awrap(_.forEach(dataArray, function _callee3(value, key, object) {
            var currency, travel;
            return regeneratorRuntime.async(function _callee3$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    value._user = userId;
                    value.amount = Number(value.amount).toFixed(2);
                    value.rate = Number(value.rate).toFixed(2);
                    value.amountConverted = Number(value.amountConverted).toFixed(2);
                    currency = {};

                    if (value.type != 'Mileage') {
                      currency = createCurrency(value);
                      value.curRate = currency;
                      delete value.rate;
                      delete value.base;
                    } else {
                      delete value.currency;
                    } // find travel for expense


                    _context9.next = 8;
                    return regeneratorRuntime.awrap(travels.find(function (item) {
                      var date = new Date(value.date);
                      var dateRange = item.dateFrom <= date && item.dateTo >= date;
                      var sameName = item.description == value.travelName;
                      var result = dateRange && sameName;

                      if (!result) {
                        return false;
                      }

                      return true;
                    }));

                  case 8:
                    travel = _context9.sent;

                    // if no travel for expense delete expense
                    if (!travel) {
                      noTravelKeys.push(key);
                    } else {
                      object[key].travel = travel._id;
                    }

                  case 10:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          }));

        case 7:
          // delete expenses that not belong to any existing travel
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context10.prev = 10;

          for (_iterator2 = noTravelKeys.sort(function (a, b) {
            return b - a;
          })[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            value = _step2.value;
            dataArray.splice(value, 1);
          } // get imported currencies


          _context10.next = 18;
          break;

        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](10);
          _didIteratorError2 = true;
          _iteratorError2 = _context10.t0;

        case 18:
          _context10.prev = 18;
          _context10.prev = 19;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 21:
          _context10.prev = 21;

          if (!_didIteratorError2) {
            _context10.next = 24;
            break;
          }

          throw _iteratorError2;

        case 24:
          return _context10.finish(21);

        case 25:
          return _context10.finish(18);

        case 26:
          _context10.next = 28;
          return regeneratorRuntime.awrap(dataArray.reduce(function (result, item) {
            if (item.curRate && item.type != 'Mileage') {
              result.push(item.curRate);
            }

            return result;
          }, []));

        case 28:
          currenciesArray = _context10.sent;
          // get unique currencies
          currenciesArray = _toConsumableArray(new Map(currenciesArray.map(function (o) {
            return [JSON.stringify(o), o];
          })).values()).sort(function (a, b) {
            return (// Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              a.date - b.date
            );
          });
          expensesCountAfter = dataArray.length;
          invalidExpensesCount = expensesCountBefore - expensesCountAfter;
          validExpensesCount = expensesCountBefore - invalidExpensesCount;
          message = "INVALID EXPENSES: ".concat(invalidExpensesCount, ". VALID EXPENSES: ").concat(validExpensesCount);
          return _context10.abrupt("return", {
            currenciesArray: currenciesArray,
            message: message
          });

        case 37:
          _context10.prev = 37;
          _context10.t1 = _context10["catch"](2);
          message = 'Something went wrong during expenses import! Check console log!';
          return _context10.abrupt("return", {
            err: _context10.t1,
            message: message
          });

        case 41:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[2, 37], [10, 14, 18, 26], [19,, 21, 25]]);
}

var updateTravels = function updateTravels(uniqueTravelObjectIds, expenses) {
  return regeneratorRuntime.async(function updateTravels$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          return _context13.abrupt("return", new Promise(function _callee5(resolve, reject) {
            var updatedTravels;
            return regeneratorRuntime.async(function _callee5$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.prev = 0;
                    _context12.next = 3;
                    return regeneratorRuntime.awrap(_.forEach(uniqueTravelObjectIds, function _callee4(value, key, object) {
                      var travelExpensesObjectIds, aggr, travel;
                      return regeneratorRuntime.async(function _callee4$(_context11) {
                        while (1) {
                          switch (_context11.prev = _context11.next) {
                            case 0:
                              travelExpensesObjectIds = expenses.filter(function (item) {
                                return item.travel === value;
                              });
                              _context11.next = 3;
                              return regeneratorRuntime.awrap(Expense.aggregate([{
                                $match: {
                                  travel: new ObjectId(value)
                                }
                              }, {
                                $group: {
                                  _id: '$travel',
                                  total: {
                                    $sum: '$amountConverted'
                                  }
                                }
                              }]));

                            case 3:
                              aggr = _context11.sent;
                              _context11.next = 6;
                              return regeneratorRuntime.awrap(Travel.findByIdAndUpdate(value, {
                                $addToSet: {
                                  expenses: {
                                    $each: travelExpensesObjectIds
                                  }
                                },
                                $set: {
                                  total: aggr[0].total
                                }
                              }, {
                                "new": true
                              }));

                            case 6:
                              travel = _context11.sent;

                            case 7:
                            case "end":
                              return _context11.stop();
                          }
                        }
                      });
                    }));

                  case 3:
                    updatedTravels = _context12.sent;
                    resolve(updatedTravels);
                    _context12.next = 10;
                    break;

                  case 7:
                    _context12.prev = 7;
                    _context12.t0 = _context12["catch"](0);
                    resolve(_context12.t0);

                  case 10:
                  case "end":
                    return _context12.stop();
                }
              }
            }, null, null, [[0, 7]]);
          }));

        case 1:
        case "end":
          return _context13.stop();
      }
    }
  });
};

var expenseImport = function expenseImport(dataArray) {
  return regeneratorRuntime.async(function expenseImport$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          return _context15.abrupt("return", new Promise(function _callee6(resolve, reject) {
            var expenses, travelObjectIds, uniqueTravelObjectIds, updatedTravels, message;
            return regeneratorRuntime.async(function _callee6$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    _context14.prev = 0;
                    _context14.next = 3;
                    return regeneratorRuntime.awrap(Expense.insertMany(dataArray)["catch"](function (err) {
                      throw new myErrors.saveToDbError('Something went wrong during saving expenses to DB!');
                    }));

                  case 3:
                    expenses = _context14.sent;

                    if (expenses) {
                      _context14.next = 6;
                      break;
                    }

                    throw new myErrors.saveToDbError('No expenses saved!');

                  case 6:
                    travelObjectIds = expenses.map(function (expense) {
                      return expense.travel;
                    });
                    uniqueTravelObjectIds = _toConsumableArray(new Set(travelObjectIds));
                    _context14.next = 10;
                    return regeneratorRuntime.awrap(updateTravels(uniqueTravelObjectIds, expenses)["catch"](function (err) {
                      throw new myErrors.saveToDbError('Something went wrong during updating travels with expenses!');
                    }));

                  case 10:
                    updatedTravels = _context14.sent;
                    message = "".concat(expenses.length, " imported. ").concat(updatedTravels.length, " travels updated!");
                    resolve(message);
                    _context14.next = 18;
                    break;

                  case 15:
                    _context14.prev = 15;
                    _context14.t0 = _context14["catch"](0);
                    resolve({
                      error: _context14.t0,
                      msg: 'Something went wrong during expense import!'
                    });

                  case 18:
                  case "end":
                    return _context14.stop();
                }
              }
            }, null, null, [[0, 15]]);
          }));

        case 1:
        case "end":
          return _context15.stop();
      }
    }
  });
};

function travelImport(dataArray, userId) {
  var message;
  return regeneratorRuntime.async(function travelImport$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          message = '';
          return _context17.abrupt("return", new Promise(function _callee7(resolve, reject) {
            var travels, travelObjectIds;
            return regeneratorRuntime.async(function _callee7$(_context16) {
              while (1) {
                switch (_context16.prev = _context16.next) {
                  case 0:
                    _context16.prev = 0;
                    _context16.next = 3;
                    return regeneratorRuntime.awrap(_.forEach(dataArray, function (value, key) {
                      value._user = userId;
                      value.total = Number(0).toFixed(2);
                    }));

                  case 3:
                    _context16.next = 5;
                    return regeneratorRuntime.awrap(Travel.insertMany(dataArray)["catch"](function (err) {
                      throw new myErrors.saveToDbError('Something went wrong during saving to DB!');
                    }));

                  case 5:
                    travels = _context16.sent;

                    if (travels) {
                      _context16.next = 8;
                      break;
                    }

                    throw new myErrors.saveToDbError('No travels saved!');

                  case 8:
                    travelObjectIds = travels.map(function (travel) {
                      return travel._id;
                    });
                    _context16.next = 11;
                    return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, {
                      $addToSet: {
                        travels: {
                          $each: travelObjectIds
                        }
                      }
                    })["catch"](function (err) {
                      throw new myErrors.saveToDbError('Something went wrong during updating user with travels!');
                    }));

                  case 11:
                    message = "".concat(travelObjectIds.length, " travels added successfully!");
                    resolve(message);
                    _context16.next = 18;
                    break;

                  case 15:
                    _context16.prev = 15;
                    _context16.t0 = _context16["catch"](0);
                    resolve({
                      error: _context16.t0,
                      msg: 'Something went wrong during travel import!'
                    });

                  case 18:
                  case "end":
                    return _context16.stop();
                }
              }
            }, null, null, [[0, 15]]);
          }));

        case 2:
        case "end":
          return _context17.stop();
      }
    }
  });
}

module.exports = {
  readCheckFileAndGetData: readCheckFileAndGetData,
  deleteFile: deleteFile,
  expensesImportSetCurrencyArray: expensesImportSetCurrencyArray,
  expensesImportNewCurrenciesForSave: expensesImportNewCurrenciesForSave,
  travelImport: travelImport,
  expenseImport: expenseImport
};

/***/ }),

/***/ "./utils/travelExpensesToPDF.js":
/*!**************************************!*\
  !*** ./utils/travelExpensesToPDF.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// test change gitflow again
var PdfPrinter = __webpack_require__(/*! pdfmake */ "pdfmake");

var moment = __webpack_require__(/*! moment */ "moment");

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var ObjectId = mongoose.Types.ObjectId;

var fs = __webpack_require__(/*! fs */ "fs");

var fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};
var printer = new PdfPrinter(fonts);

function toCurrencyFormat(amount) {
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  var result = formatter.format(amount);
  return result;
}

function buildTableBody(data, columns, tableHeader) {
  var total = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var body = [];

  if (!tableHeader) {
    tableHeader = columns;
  }

  body.push(tableHeader);
  data.forEach(function (row) {
    var dataRow = [];
    columns.forEach(function (column) {
      var dataRowObject = {};
      dataRowObject.text = row[column].toString();

      if (['amount', 'rate', tableHeader[tableHeader.length - 1]].includes(column)) {
        dataRowObject.alignment = 'right';
      } else if (column === 'description') {
        dataRowObject.alignment = 'left';
      } else {
        dataRowObject.alignment = 'center';
      } // dataRow.push(row[column].toString());


      dataRow.push(dataRowObject);
    });
    body.push(dataRow);
  });
  var totalRowStyle = {
    alignment: 'right',
    bold: true,
    fontSize: 12
  };
  var totalRow = [{
    colSpan: 6,
    text: "TOTAL",
    style: totalRowStyle
  }, {}, {}, {}, {}, {}, {
    text: toCurrencyFormat(total),
    style: totalRowStyle
  }];
  body.push(totalRow);
  return body;
}

function table(data, columns, tableHeader) {
  var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var travelTotal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  return {
    style: style,
    layout: 'lightHorizontalLines',
    alignment: 'center',
    table: {
      widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
      heights: function heights(row) {
        switch (row) {
          case 0:
            return 10;
            break;

          case data.length + 1:
            return 5;

          default:
            return 20;
        }
      },
      headerRows: 1,
      body: buildTableBody(data, columns, tableHeader, travelTotal)
    }
  };
}

function createTravelExpensesTableData(travel) {
  var expenses = travel.expenses;
  var dataObjects = [];
  expenses.forEach(function (expense, key, object) {
    var newObject = {};
    newObject.date = moment(expense.date).format('l');
    newObject.type = expense.type;
    newObject.description = expense.description, newObject.amount = toCurrencyFormat(expense.amount);

    if (expense.type != 'Mileage') {
      newObject.currency = Object.keys(expense.curRate.rate)[0];
      newObject.rate = Object.values(expense.curRate.rate)[0];
    } else {
      newObject.currency = expense.unit;
      newObject.rate = travel.perMileAmount;
    }

    newObject[travel.homeCurrency] = expense.amountConverted;
    dataObjects.push(newObject);
  });
  return dataObjects;
}

module.exports = function (travel, user, idx) {
  if (!user.profile.name) {
    user.profile.name = 'Unknown';
  } // console.log(typeof ObjectId(travel._id).getTimestamp());
  // console.log(typeof ObjectId(travel._id).toString());
  // console.log(typeof ObjectId(travel._id).valueOf());


  var invoiceNumber = ObjectId(travel._id).toString() + "-" + idx;
  var dateFrom = moment(travel.dateFrom).format('ddd, MMM Do YYYY');
  var dateTo = moment(travel.dateTo).format('ddd, MMM Do YYYY');
  var tableData = createTravelExpensesTableData(travel);
  var dataProperties = ['date', 'type', 'description', 'amount', 'currency', 'rate', travel.homeCurrency];
  var tableHeader = ['DATE', 'TYPE', 'DESCRIPTION', 'AMOUNT', 'CURRENCY', 'RATE', travel.homeCurrency];
  var tableStyle = {
    alignment: 'center',
    fontSize: 10,
    margin: [20, 0, 20, 0],
    width: '*'
  };
  var titlePdf = "".concat(travel.description);
  var authorPdf = "".concat(user.profile.name);
  var subjectPdf = 'Travel expenses';
  var keywordsPdf = 'travel report expense';
  var expensesTable = table(tableData, dataProperties, tableHeader, tableStyle, travel.total);
  var total = toCurrencyFormat(travel.total);
  var docDefinition = {
    // ...
    // pageSize: 'A4',
    footer: function footer(currentPage, pageCount, pageSize) {
      return [{
        canvas: [{
          type: 'line',
          x1: 30,
          y1: 15,
          x2: 559.28,
          y2: 15,
          lineWidth: 1,
          lineCap: 'square'
        }]
      }, {
        text: currentPage.toString() + ' of ' + pageCount,
        alignment: 'center',
        fontSize: 10,
        margin: [0, 10]
      }];
    },
    header: function header(currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element
      return [{
        columns: [{
          text: 'Created with TExpApp',
          alignment: currentPage % 2 ? 'left' : 'right',
          fontSize: 10
        }, {
          text: moment().format('YYYY-MM-DD'),
          alignment: currentPage % 2 ? 'right' : 'left',
          fontSize: 10
        }]
      }, {
        canvas: [{
          type: 'rect',
          x: 170,
          y: 32,
          w: pageSize.width - 170,
          h: 100,
          fillColor: 'red'
        }]
      }];
    },
    info: {
      producer: 'TExpApp',
      title: titlePdf,
      author: authorPdf,
      subject: subjectPdf,
      keywords: keywordsPdf
    },
    content: [{
      stack: [{
        text: 'EXPENSES REPORT'
      }],
      style: 'title'
    }, {
      stack: [{
        style: 'personInfo',
        layout: 'noBorders',
        table: {
          style: 'personInfo',
          widths: ['auto', 'auto'],
          body: [['Team:', user.team], ['Name:', user.fullName()], ['Position:', user.jobPosition]]
        }
      }]
    }, {
      stack: [{
        text: "invoice: ".concat(invoiceNumber)
      }, {
        text: travel.description,
        style: 'description'
      }, {
        layout: 'noBorders',
        table: {
          style: 'travelDate',
          widths: ['*', 'auto'],
          body: [['From:', dateFrom], ['To:', dateTo]]
        }
      }],
      style: 'travelInfo'
    }, {
      text: "Total: ".concat(travel.homeCurrency, " ").concat(total),
      margin: [0, 0, 0, 20],
      color: '#696969'
    }, expensesTable],
    styles: {
      title: {
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 10]
      },
      personInfo: {
        fontSize: 12,
        margin: [0, 0, 0, 30],
        alignment: 'left',
        color: '#696969'
      },
      travelInfo: {
        margin: [0, 20, 0, 30],
        alignment: 'right'
      },
      description: {
        fontSize: 18,
        bold: true
      },
      travelDate: {
        fontSize: 12,
        bold: false
      }
    }
  };
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  var pdfDocPath = "./pdf/TReport_".concat(user._id, "_").concat(travel._id, "-").concat(idx, ".pdf");
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  return pdfDoc;
};

/***/ }),

/***/ "./utils/travelsTotalToPDF.js":
/*!************************************!*\
  !*** ./utils/travelsTotalToPDF.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// test change gitflow again
var PdfPrinter = __webpack_require__(/*! pdfmake */ "pdfmake");

var moment = __webpack_require__(/*! moment */ "moment");

var fs = __webpack_require__(/*! fs */ "fs");

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var User = __webpack_require__(/*! ../models/User */ "./models/User.js");

var ObjectId = mongoose.Schema.Types.ObjectId;
var fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};
var printer = new PdfPrinter(fonts);

function toCurrencyFormat(amount) {
  var formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  var result = formatter.format(amount);
  return result;
}

function buildTableBody(data, columns, tableHeader) {
  var total = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var totalInCurrencyFormat = toCurrencyFormat(total);
  var body = [];

  if (!tableHeader) {
    tableHeader = columns;
  }

  body.push(tableHeader);
  data.forEach(function (row) {
    var dataRow = [];
    columns.forEach(function (column) {
      var dataRowObject = {};
      dataRowObject.text = row[column].toString();

      if (['amount', 'perMile', tableHeader[tableHeader.length - 1]].includes(column)) {
        dataRowObject.alignment = 'right';
      } else if (column === 'description') {
        dataRowObject.alignment = 'left';
      } else {
        dataRowObject.alignment = 'center';
      }

      dataRow.push(dataRowObject);
    });
    var invoiceNumberStyle = {
      alignment: 'left',
      bold: true,
      fontSize: 8
    };
    var idRow = [{
      colSpan: 1,
      text: "invoice:",
      style: invoiceNumberStyle
    }, {
      colSpan: 1,
      text: row._id,
      style: invoiceNumberStyle
    }, {}, {}, {}, {}];
    body.push(idRow);
    body.push(dataRow);
  });
  var totalRowStyle = {
    alignment: 'right',
    bold: true,
    fontSize: 12
  };
  var totalRow = [{
    colSpan: 5,
    text: "TOTAL",
    style: totalRowStyle
  }, {}, {}, {}, {}, {
    text: totalInCurrencyFormat,
    style: totalRowStyle
  }];
  body.push(totalRow);
  return body;
}

function table(data, columns, tableHeader) {
  var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var sum = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  return {
    style: style,
    layout: 'lightHorizontalLines',
    alignment: 'center',
    table: {
      widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],
      heights: function heights(row) {
        switch (row) {
          case 0:
            return 10;
            break;

          case data.length * 2 + 1:
            return 5;
            break;
        }

        var h = row % 2 === 0 ? 20 : 10;
        return h;
      },
      headerRows: 1,
      body: buildTableBody(data, columns, tableHeader, sum)
    }
  };
}

function createTravelsTotalTableData(travels, indexes) {
  var dataObjects = [];
  travels.forEach(function (travel, key, object) {
    var newObject = {};
    newObject._id = travel._id.toString() + "-" + indexes[key];
    newObject.dateFrom = moment(travel.dateFrom).format('l');
    newObject.dateTo = moment(travel.dateTo).format('l');
    newObject.description = travel.description;
    newObject.currency = travel.homeCurrency;
    newObject.perMile = travel.perMileAmount;
    newObject.amount = toCurrencyFormat(travel.total);
    dataObjects.push(newObject);
  });
  return dataObjects;
}

module.exports = function (travels, user, dateRange, sum, indexes) {
  console.log(indexes);
  var titlePdf = "TOTAL";
  var authorPdf = "".concat(user.profile.name);
  var subjectPdf = 'Travel expenses';
  var keywordsPdf = 'travel report expense';
  var df = dateRange.df;
  var dt = dateRange.dt;
  var dateFrom = moment(df).format('ddd, MMM Do YYYY');
  var dateTo = moment(dt).format('ddd, MMM Do YYYY');
  var tableData = createTravelsTotalTableData(travels, indexes);
  var dataProperties = ['dateFrom', 'dateTo', 'description', 'currency', 'perMile', 'amount'];
  var homeDistance;

  if (user.homeDistance === 'mi') {
    homeDistance = 'MILE';
  } else if (user.homeDistance === 'km') {
    homeDistance = 'KM';
  } else {
    homeDistance = 'X';
  }

  var tableHeader = ['FROM', 'TO', 'DESCRIPTION', 'CUR', "PER ".concat(homeDistance), 'AMOUNT'];
  var tableStyle = {
    alignment: 'center',
    fontSize: 10,
    margin: [20, 0, 20, 0],
    width: '*'
  };
  var travelsTable = table(tableData, dataProperties, tableHeader, tableStyle, sum);
  sum = toCurrencyFormat(sum);
  var docDefinition = {
    // ...
    // pageSize: 'A4',
    footer: function footer(currentPage, pageCount, pageSize) {
      return [{
        canvas: [{
          type: 'line',
          x1: 30,
          y1: 15,
          x2: 559.28,
          y2: 15,
          lineWidth: 1,
          lineCap: 'square'
        }]
      }, {
        text: currentPage.toString() + ' of ' + pageCount,
        alignment: 'center',
        fontSize: 10,
        margin: [0, 10]
      }];
    },
    header: function header(currentPage, pageCount, pageSize) {
      // you can apply any logic and return any valid pdfmake element
      return [{
        columns: [{
          text: 'Created with TExpApp',
          alignment: currentPage % 2 ? 'left' : 'right',
          fontSize: 10
        }, {
          text: moment().format('YYYY-MM-DD'),
          alignment: currentPage % 2 ? 'right' : 'left',
          fontSize: 10
        }]
      }, {
        canvas: [{
          type: 'rect',
          x: 170,
          y: 32,
          w: pageSize.width - 170,
          h: 100,
          fillColor: 'red'
        }]
      }];
    },
    info: {
      producer: 'myApp',
      title: titlePdf,
      author: authorPdf,
      subject: subjectPdf,
      keywords: keywordsPdf
    },
    content: [{
      stack: [{
        text: 'TOTAL REPORT'
      }],
      style: 'title'
    }, {
      stack: [{
        style: 'personInfo',
        layout: 'noBorders',
        table: {
          style: 'personInfo',
          widths: ['auto', 'auto'],
          body: [['Team:', user.team], ['Name:', user.fullName()], ['Position:', user.jobPosition]]
        }
      }]
    }, {
      stack: [{
        text: 'TOTAL',
        style: 'description'
      }, {
        layout: 'noBorders',
        table: {
          style: 'travelDate',
          widths: ['*', 'auto'],
          body: [['From:', dateFrom], ['To:', dateTo]]
        }
      }],
      style: 'travelInfo'
    }, {
      text: "Total: ".concat(user.homeCurrency, " ").concat(sum),
      margin: [0, 0, 0, 20],
      color: '#696969'
    }, travelsTable],
    styles: {
      title: {
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 10]
      },
      personInfo: {
        fontSize: 12,
        margin: [0, 0, 0, 30],
        alignment: 'left',
        color: '#696969'
      },
      travelInfo: {
        margin: [0, 20, 0, 30],
        alignment: 'right'
      },
      description: {
        fontSize: 18,
        bold: true
      },
      travelDate: {
        fontSize: 12,
        bold: false
      }
    }
  };
  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  var pdfDocPath = "./pdf/TOTAL_".concat(user._id, "_").concat(df, "_").concat(dt, ".pdf");
  pdfDoc.pipe(fs.createWriteStream(pdfDocPath));
  pdfDoc.end();
  return pdfDoc;
};

/***/ }),

/***/ "./utils/updateExpensesToMatchTravelRangeDates.js":
/*!********************************************************!*\
  !*** ./utils/updateExpensesToMatchTravelRangeDates.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var moment = __webpack_require__(/*! moment */ "moment");

var Travel = __webpack_require__(/*! ../models/Travel */ "./models/Travel.js");

var Expense = __webpack_require__(/*! ../models/Expense */ "./models/Expense.js");

var Rate = __webpack_require__(/*! ../models/Rate */ "./models/Rate.js");

var Currency = __webpack_require__(/*! ../models/Currency */ "./models/Currency.js");

var findRatesByExactOrClosestDate = __webpack_require__(/*! ./utils */ "./utils/utils.js").findRatesByExactOrClosestDate;

var convertRateToHomeCurrencyRate = __webpack_require__(/*! ./utils */ "./utils/utils.js").convertRateToHomeCurrencyRate;

function checkExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom || expDate > travelDateTo) {
    return true;
  } else {
    return false;
  }
}

function setNewExpenseDate(expDate, travelDateFrom, travelDateTo) {
  if (expDate < travelDateFrom) {
    return travelDateFrom;
  } else if (expDate > travelDateTo) {
    return travelDateTo;
  }
}

function createNewCurrency(expenseDate, homeCurrency, invoiceCurrency) {
  var cur, dateRates, convertedRate, curRate;
  return regeneratorRuntime.async(function createNewCurrency$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          cur = {};
          _context.next = 4;
          return regeneratorRuntime.awrap(findRatesByExactOrClosestDate(expenseDate));

        case 4:
          dateRates = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(convertRateToHomeCurrencyRate(dateRates.rates, homeCurrency, invoiceCurrency));

        case 7:
          convertedRate = _context.sent;
          cur[invoiceCurrency] = convertedRate;
          curRate = new Currency({
            base: homeCurrency,
            date: expenseDate,
            rate: cur
          });
          return _context.abrupt("return", {
            curRate: curRate,
            convertedRate: convertedRate
          });

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

function updateExpense(expenseId, expenseAmount, expenseDate, convertedRate, rateObjectId) {
  var amountConverted, doc;
  return regeneratorRuntime.async(function updateExpense$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          amountConverted = Number((expenseAmount / convertedRate).toFixed(2));
          _context2.next = 4;
          return regeneratorRuntime.awrap(Expense.findByIdAndUpdate(expenseId, {
            $set: {
              date: expenseDate,
              curRate: rateObjectId,
              amountConverted: amountConverted
            }
          }));

        case 4:
          doc = _context2.sent;
          return _context2.abrupt("return", doc);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          throw new Error(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

module.exports = function _callee4(travel, rates) {
  return regeneratorRuntime.async(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", new Promise(function _callee3(resolve, reject) {
            var dateFrom, dateTo, travelHomeCurrency, expenses, result;
            return regeneratorRuntime.async(function _callee3$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    dateFrom = travel.dateFrom;
                    dateTo = travel.dateTo;
                    travelHomeCurrency = travel.homeCurrency;
                    expenses = travel.expenses;
                    result = [];
                    _context5.prev = 5;
                    _context5.next = 8;
                    return regeneratorRuntime.awrap(expenses.forEach(function _callee2(expense) {
                      var invoiceCurrency, doc;
                      return regeneratorRuntime.async(function _callee2$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (!checkExpenseDate(expense.date, dateFrom, dateTo)) {
                                _context4.next = 12;
                                break;
                              }

                              expense.date = setNewExpenseDate(expense.date, dateFrom, dateTo);

                              if (!(expense.type != 'Mileage')) {
                                _context4.next = 7;
                                break;
                              }

                              invoiceCurrency = Object.keys(expense.curRate.rate)[0];
                              Currency.find({
                                base: travelHomeCurrency,
                                date: expense.date
                              }, function _callee(err, curRates) {
                                var filertedRatesFromDB, _ref, curRate, convertedRate, rateObjectId, _convertedRate, _rateObjectId;

                                return regeneratorRuntime.async(function _callee$(_context3) {
                                  while (1) {
                                    switch (_context3.prev = _context3.next) {
                                      case 0:
                                        filertedRatesFromDB = curRates.filter(function (item) {
                                          return !isNaN(item.rate[invoiceCurrency]);
                                        });

                                        if (!(filertedRatesFromDB.length === 0)) {
                                          _context3.next = 14;
                                          break;
                                        }

                                        _context3.next = 4;
                                        return regeneratorRuntime.awrap(createNewCurrency(expense.date, travelHomeCurrency, invoiceCurrency));

                                      case 4:
                                        _ref = _context3.sent;
                                        curRate = _ref.curRate;
                                        convertedRate = _ref.convertedRate;
                                        _context3.next = 9;
                                        return regeneratorRuntime.awrap(curRate.save());

                                      case 9:
                                        rateObjectId = curRate._id;
                                        _context3.next = 12;
                                        return regeneratorRuntime.awrap(updateExpense(expense._id, expense.amount, expense.date, convertedRate, rateObjectId).then(function (doc) {
                                          result.push(doc);

                                          if (result.length === expenses.length) {
                                            resolve(result);
                                          }
                                        }));

                                      case 12:
                                        _context3.next = 18;
                                        break;

                                      case 14:
                                        _convertedRate = filertedRatesFromDB[0].rate[invoiceCurrency];
                                        _rateObjectId = filertedRatesFromDB[0]._id;
                                        _context3.next = 18;
                                        return regeneratorRuntime.awrap(updateExpense(expense._id, expense.amount, expense.date, _convertedRate, _rateObjectId).then(function (doc) {
                                          result.push(doc);

                                          if (result.length === expenses.length) {
                                            resolve(result);
                                          }
                                        }));

                                      case 18:
                                      case "end":
                                        return _context3.stop();
                                    }
                                  }
                                });
                              });
                              _context4.next = 10;
                              break;

                            case 7:
                              _context4.next = 9;
                              return regeneratorRuntime.awrap(expense.save(function (doc) {
                                result.push(doc);

                                if (result.length === expenses.length) {
                                  resolve(result);
                                }
                              }));

                            case 9:
                              doc = _context4.sent;

                            case 10:
                              _context4.next = 14;
                              break;

                            case 12:
                              result.push(expense);

                              if (result.length === expenses.length) {
                                resolve(result);
                              }

                            case 14:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      });
                    }));

                  case 8:
                    _context5.next = 13;
                    break;

                  case 10:
                    _context5.prev = 10;
                    _context5.t0 = _context5["catch"](5);
                    reject(new Error(_context5.t0));

                  case 13:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[5, 10]]);
          }));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
};

/***/ }),

/***/ "./utils/utils.js":
/*!************************!*\
  !*** ./utils/utils.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Rate = __webpack_require__(/*! ../models/Rate */ "./models/Rate.js");

var convertRateToHomeCurrencyRate = function convertRateToHomeCurrencyRate(rates, homeCurrency, invoiceCurrency) {
  homeCurrency = homeCurrency.toUpperCase();
  invoiceCurrency = invoiceCurrency.toUpperCase();
  var homeCurrencyRate = rates[homeCurrency];
  var convertedRate = 1 / homeCurrencyRate;
  var baseRate = rates[invoiceCurrency];
  var invoiceRate = Number((baseRate * convertedRate).toFixed(2));
  return invoiceRate;
};

var findRatesByExactOrClosestDate = function findRatesByExactOrClosestDate() {
  var date,
      exactDate,
      greaterDate,
      lowerDate,
      diffGreater,
      diffLower,
      _args = arguments;
  return regeneratorRuntime.async(function findRatesByExactOrClosestDate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          date = _args.length > 0 && _args[0] !== undefined ? _args[0] : new Date();
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Rate.find({
            date: date
          }, function (err, items) {
            return items;
          }));

        case 4:
          exactDate = _context.sent;

          if (!(exactDate.length === 1)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", exactDate[0]);

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(Rate.findOne({
            date: {
              $gt: date
            }
          }, function (err, item) {
            return item;
          }).sort({
            date: 1
          }));

        case 9:
          greaterDate = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(Rate.findOne({
            date: {
              $lt: date
            }
          }, function (err, item) {
            return item;
          }).sort({
            date: -1
          }));

        case 12:
          lowerDate = _context.sent;

          if (!(greaterDate && lowerDate)) {
            _context.next = 23;
            break;
          }

          diffGreater = Math.abs(date.getTime() - greaterDate.date.getTime());
          diffLower = Math.abs(date.getTime() - lowerDate.date.getTime());

          if (!(diffGreater < diffLower)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", greaterDate);

        case 20:
          return _context.abrupt("return", lowerDate);

        case 21:
          _context.next = 36;
          break;

        case 23:
          if (!(!greaterDate && !lowerDate)) {
            _context.next = 27;
            break;
          }

          return _context.abrupt("return", 'FUCK!');

        case 27:
          if (!greaterDate) {
            _context.next = 31;
            break;
          }

          return _context.abrupt("return", greaterDate);

        case 31:
          if (!lowerDate) {
            _context.next = 35;
            break;
          }

          return _context.abrupt("return", lowerDate);

        case 35:
          return _context.abrupt("return", 'FUCK AGAIN!');

        case 36:
          _context.next = 41;
          break;

        case 38:
          _context.prev = 38;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", _context.t0);

        case 41:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 38]]);
};

var toTitleCase = function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

String.prototype.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
/*
 * Creates HTML elements
 * @param {string} tag
 * @param {object} options
 * @param {string} text
 * @param {boolean} closingTag
 */


var createElement = function createElement(tag) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Hello World";
  var closingTag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var tagStart = "<".concat(tag, ">");
  var tagEnd = "</".concat(tag, ">");
  var attrs = '';
  var result = '';
  var insertIndex = tagStart.length - 1;
  var attrArray = [" "];

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        attr = _Object$entries$_i[0],
        val = _Object$entries$_i[1];

    attr = attr.replace(/_/g, '-');
    var arr = [];

    if (val instanceof Array) {
      val.forEach(function (val1) {
        var val2 = "".concat(val1, " ");
        arr.push(val2);
      });
    } else {
      arr.push(val);
    }

    var rAttr = arr.join('');
    var lAttr = "".concat(attr, "=\"").concat(rAttr, "\"");
    attrArray.push(lAttr);
  };

  for (var _i = 0, _Object$entries = Object.entries(options); _i < _Object$entries.length; _i++) {
    _loop();
  }

  attrs = attrArray.join(' ');
  tagStart = tagStart.splice(insertIndex, 0, attrs);

  if (closingTag) {
    result = tagStart + text + tagEnd;
  } else {
    result = tagStart + text;
  }

  return result;
};
/*
 * Returns 2 HTML elements as one string
 */


var createTwoCardElements = function createTwoCardElements(tagArr, optionArr) {
  var textArr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['', ''];
  var closingArr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [true, true, true];
  var insert = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var labelText = createElement(tagArr[0], optionArr[0], textArr[0], closingArr[0]);
  var labelElem = createElement(tagArr[1], optionArr[1], labelText, closingArr[1]);
  var expenseElem = createElement(tagArr[2], optionArr[2], textArr[1], closingArr[2]);
  return labelElem + insert + expenseElem;
};

var createOptions = function createOptions(options, selected) {
  var elemAttrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var valueToLowerCase = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var result = '';
  selected = !selected ? '' : selected;
  options.forEach(function (val) {
    // console.log(val);
    var optionVal = valueToLowerCase ? val.toLowerCase() : val; // console.log(optionVal, val, selected);

    elemAttrs.value = optionVal;

    if (optionVal.toLowerCase() === selected.toLowerCase()) {
      elemAttrs.selected = 'selected';
    }

    ;
    var htmlElem = createElement('option', elemAttrs, val);

    if (elemAttrs.selected) {
      delete elemAttrs.selected;
    }

    result = result + htmlElem;
  });
  delete elemAttrs.value;
  return result;
};

module.exports = {
  convertRateToHomeCurrencyRate: convertRateToHomeCurrencyRate,
  findRatesByExactOrClosestDate: findRatesByExactOrClosestDate,
  toTitleCase: toTitleCase,
  createElement: createElement,
  createTwoCardElements: createTwoCardElements,
  createOptions: createOptions
};

/***/ }),

/***/ 0:
/*!**************************************!*\
  !*** multi @babel/polyfill ./app.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! @babel/polyfill */"@babel/polyfill");
module.exports = __webpack_require__(/*! ./app.js */"./app.js");


/***/ }),

/***/ "@babel/polyfill":
/*!**********************************!*\
  !*** external "@babel/polyfill" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@babel/polyfill");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "bcrypt-nodejs":
/*!********************************!*\
  !*** external "bcrypt-nodejs" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "chalk":
/*!************************!*\
  !*** external "chalk" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "connect-mongo":
/*!********************************!*\
  !*** external "connect-mongo" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-mongo");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "errorhandler":
/*!*******************************!*\
  !*** external "errorhandler" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("errorhandler");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-flash":
/*!********************************!*\
  !*** external "express-flash" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-flash");

/***/ }),

/***/ "express-formidable":
/*!*************************************!*\
  !*** external "express-formidable" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-formidable");

/***/ }),

/***/ "express-hbs":
/*!******************************!*\
  !*** external "express-hbs" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-hbs");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "full-icu":
/*!***************************!*\
  !*** external "full-icu" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("full-icu");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "lusca":
/*!************************!*\
  !*** external "lusca" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lusca");

/***/ }),

/***/ "method-override":
/*!**********************************!*\
  !*** external "method-override" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("method-override");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "node-mailjet":
/*!*******************************!*\
  !*** external "node-mailjet" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-mailjet");

/***/ }),

/***/ "node-sass-middleware":
/*!***************************************!*\
  !*** external "node-sass-middleware" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-sass-middleware");

/***/ }),

/***/ "node-schedule":
/*!********************************!*\
  !*** external "node-schedule" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-schedule");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

/***/ }),

/***/ "papaparse":
/*!****************************!*\
  !*** external "papaparse" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("papaparse");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-google-oauth":
/*!****************************************!*\
  !*** external "passport-google-oauth" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-google-oauth");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),

/***/ "passport-oauth":
/*!*********************************!*\
  !*** external "passport-oauth" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-oauth");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "pdfmake":
/*!**************************!*\
  !*** external "pdfmake" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("pdfmake");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=main.js.map