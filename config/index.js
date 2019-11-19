const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const appRoot = require('app-root-path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Set the NODE_ENV to 'development' by default
const config = dotenv.config({ debug: process.env.DEBUG });

dotenvExpand(config);
if (config.error) {
  throw config.error;
}

process.env.NODE_ENV = process.env.NODE_ENV || config.NODE_ENV || 'development';

module.exports = {
  //  * Environment mode
  envNode: process.env.NODE_ENV,

  //  * Environment host
  envHost: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',

  //  * Your favorite port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT,

  //  * That long string from mlab
  databaseURL: process.env.MONGODB_URI,

  //  * Your secret sauce
  jwtSecret: process.env.JWT_SECRET,

  //  * Used by winston logger
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },

  //  * API configs
  api: {
    prefix: '/'
  },

  //  * Views
  views: appRoot.resolve('views'),

  //  * HBS configuration
  hbs: {
    layoutsDir: appRoot.resolve('views', 'layouts'),
    partialsDir: [
      appRoot.resolve('views', 'partials'),
      appRoot.resolve('views', 'account'),
      appRoot.resolve('views', 'travels')
    ],
    defaultView: 'layout',
    extname: '.hbs'
  },

  //  * SASS configuration
  sass: {
    src: appRoot.resolve('public'),
    dest: appRoot.resolve('public')
  },

  // * SESSION configuration
  session: {
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true
    })
  },

  // * FORMIDABLE
  formidable: {
    encoding: 'utf-8',
    uploadDir: appRoot.resolve('/uploads'),
    keepExtensions: true
  },

  // * LUSCA - before I had only xframe and xssProtection
  lusca: {
    csrf: true,
    // csp: {}, // csp policy must be array, string, or plain object
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: 'same-origin'
  },

  //  * Agenda.js stuff
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10)
  },

  //  * Agendash config
  agendash: {
    user: 'agendash',
    password: '123456'
  },

  //  * MailJet email credentials
  emails: {
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    domain: process.env.MJ_APIKEY_PRIVATE
  }
};