/**
 * @fileoverview Sets configurations variables
 *
 * @requires NPM:app-root-path
 * @requires NPM:express-session
 * @requires NPM:connect-mongo(session)
 *
 */

const appRoot = require('app-root-path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 * Config variables module
 * @module
 * @property {String} envNode Node environment variable: development, production, test
 * @property {String} envHost Environment host
 * @property {String} port Environment port
 * @property {String} databaseURL MongoDB url
 * @property {Object} mongooseOptions Mongoose options
 * @property {boolean} mongooseOptions.useFindAndModify
 * @property {boolean} mongooseOptions.useNewUrlParser
 * @property {boolean} mongooseOptions.useCreateIndex
 * @property {boolean} mongooseOptions.useUnifiedTopology
 * @property {String} jwtSecret
 * @property {Object} logs
 * @property {String} logs.level
 * @property {Object} api
 * @property {String} api.prefix
 * @property {String} views
 * @property {Object} hbs
 * @property {String} hbs.layoutsDir Path to layouts folder
 * @property {String[]} hbs.partialsDir Paths to partials folder
 * @property {String} hbs.defaultView Name of default view
 * @property {String} hbs.extname File extension
 * @property {Object} sass
 * @property {String} sass.src Path name for source
 * @property {String} sass.dest Path name for destination
 * @property {String} static
 * @property {String} static.pub Path to public folder
 * @property {String} static.popper Path to popper folder
 * @property {String} static.bootstap Path to bootstrap folder
 * @property {String} static.jquery Path to jQuery folder
 * @property {String} static.webfonts Path to webfonts folder
 * @property {Object} session
 * @property {boolean} session.resave
 * @property {boolean} session.savUninitialized
 * @property {string} session.secret
 * @property {Object} session.cookie
 * @property {Object} session.store
 * @property {Object} formidable
 * @property {String} formidable.encoding
 * @property {String} formidable.uploadDir Path to upload folder
 * @property {boolean} formidable.keepExtensions Whether to keep extension or not
 * @property {Object} lusca
 * @property {boolean} lusca.csrf
 * @property {String} lusca.xframe
 * @property {String} lusca.p3p
 * @property {Object} lusca.hsts
 * @property {boolean} lusca.xssProtection
 * @property {boolean} lusca.nosniff
 * @property {String} lusca.refferPolicy
 * @property {Object} agenda
 * @property {String} agenda.dbCollection
 * @property {String} agenda.pooltime
 * @property {function} agenda.concurrency
 * @property {Object} agendash agendash credentials
 * @property {String} agendash.user
 * @property {String} agendash.password
 * @property {Object} emails
 * @property {String} emails.apiKey
 * @property {String} emails.domain
 * 
 */
module.exports = {
  /**
   * Environment mode
   * @type {String}
   */
  envNode: process.env.NODE_ENV,

  /**
   * Environment host
   * @type {String}
   */
  envHost: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',

  /**
   * Your favorite port
   * @type {String}
   */
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT,

  /**
   * MongoDB url
   * @type {String}
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Mongoose options
   * @type {Object}
   * @property {boolean} useFindAndModify True by default. Set to false to make
   * findOneAndUpdate() and findOneAndRemove()
   * use native findOneAndUpdate() rather than findAndModify().
   * @property {boolean} useNewUrlParser
   * @property {boolean} useCreateIndex False by default. Set to true to make
   * Mongoose's default index build use createIndex() instead of ensureIndex()
   * to avoid deprecation warnings from the MongoDB driver.
   * @property {boolean} useUnifiedTopology
   * @see npm {@link https://www.npmjs.com/package/mongoose}
   * @see official {@link https://mongoosejs.com/docs/connections.html#options}
   */
  mongooseOptions: {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  },

  /**
   * Your secret sauce
   * @type {String}
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Used by winston logger
   * @type {Object}
   * @property {String} level Define log level
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },

  /**
   * API configurations
   * @type {Object}
   * @property {String} prefix Api routes prefix
   */
  api: {
    prefix: '/'
  },

  /**
   * Views
   * @type {String}
   */
  views: appRoot.resolve('views'),

  /**
   * HBS configuration
   * @type {Object}
   * @property {String} layoutsDir Path to layouts folder
   * @property {String[]} partialsDir Paths to partials folder
   * @property {String} defaultView Name of default view
   * @property {String} extname File extension
   * @see npm {@link https://www.npmjs.com/package/express-hbs}
   */
  hbs: {
    layoutsDir: appRoot.resolve('views/layouts'),
    partialsDir: [
      appRoot.resolve('views/partials'),
      appRoot.resolve('views/account'),
      appRoot.resolve('views/travels')
    ],
    defaultView: 'layout',
    extname: '.hbs'
  },

  /**
   * SASS configuration
   * @type {Object}
   * @property {String} src Path name for source
   * @property {String} dest Path name for destination
   * @see npm {@link https://www.npmjs.com/package/sass}
   * @see official {@link https://sass-lang.com/documentation}
   */
  sass: {
    src: appRoot.resolve('public'),
    dest: appRoot.resolve('public')
  },

  /**
   * Static folders
   * @type {Object}
   * @property {String} pub Path to public folder
   * @property {String} popper Path to popper folder
   * @property {String} bootstap Path to bootstrap folder
   * @property {String} jquery Path to jQuery folder
   * @property {String} webfonts Path to webfonts folder
   */
  static: {
    pub: appRoot.resolve('public'),
    popper: appRoot.resolve('node_modules/popper.js/dist/umd'),
    bootstrap: appRoot.resolve('node_modules/bootstrap/dist/js'),
    jquery: appRoot.resolve('node_modules/jquery/dist'),
    webfonts: appRoot.resolve(
      'node_modules/@fortawesome/fontawesome-free/webfonts'
    )
  },

  /**
   * Express SESSION configuration
   * @type {Object}
   * @property {boolean} resave
   * @property {boolean} savUninitialized
   * @property {string} secret
   * @property {Object} cookie
   * @property {Object} store
   * @see npm {@link https://www.npmjs.com/package/express-session}
   */
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

  /**
   * FORMIDABLE configuration
   * @type {Object}
   * @property {String} encoding
   * @property {String} uploadDir Path to upload folder
   * @property {boolean} keepExtensions Whether to keep extension or not
   * @see npm {@link https://www.npmjs.com/package/express-formidable}
   */
  formidable: {
    encoding: 'utf-8',
    uploadDir: appRoot.resolve('/uploads'),
    keepExtensions: true
  },

  /**
   * LUSCA configuration
   * @type {Object}
   * @property {boolean} csrf
   * @property {String} xframe
   * @property {String} p3p
   * @property {Object} hsts
   * @property {boolean} xssProtection
   * @property {boolean} nosniff
   * @property {String} refferPolicy
   * @see npm {@link https://www.npmjs.com/package/lusca}
   */
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

  /**
   * Agenda.js stuff
   * @todo Not used at the moment
   * @type {Object}
   * @property {String} dbCollection
   * @property {String} pooltime
   * @property {function} concurrency
   * @see npm {@link https://www.npmjs.com/package/agenda}
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10)
  },

  /**
   * Agendash configuration
   * @todo Not used at the moment
   * @type {Object}
   * @property {String} user
   * @property {String} password
   * @see npm {@link https://www.npmjs.com/package/agendash}
   */
  agendash: {
    user: 'agendash',
    password: '123456'
  },

  /**
   * MailJet email credentials
   * @type {Object}
   * @property {String} apiKey
   * @property {String} domain
   * @see npm {@link https://www.npmjs.com/package/node-mailjet}
   * @see official {@link https://dev.mailjet.com/email/guides/?javascript#}
   */
  emails: {
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    domain: process.env.MJ_APIKEY_PRIVATE
  }
};
