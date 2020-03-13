const appRoot = require('app-root-path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 * @memberof module:config
 * @alias mongooseOptions
 * @typedef {object} mongooseOptions
 * @property {boolean} useFindAndModify
 * @property {boolean} useNewUrlParser
 * @property {boolean} useCreateIndex
 * @property {boolean} useUnifiedTopology
 * @see {@link https://mongoosejs.com/docs/connections.html#options NPM:mongoose}
 */

/**
 * @memberof module:config
 * @alias google
 * @typedef {object} google
 * @property {string} id     Google id.
 * @property {string} secret Google secret.
 */

/**
 * @memberof module:config
 * @alias logs
 * @typedef {object} logs
 * @property {string} level Log level. Env file or silly.
 */

/**
 * @memberof module:config
 * @alias api
 * @typedef {object} api
 * @property {string} prefix Api routes prefix.
 */

/**
 * @memberof module:config
 * @alias hbs
 * @typedef {object} hbs
 * @property {string} layoutsDir    Path to layouts' folder.
 * @property {String[]} partialsDir Paths to partials' folder.
 * @property {string} defaultView   Default layout - 'layout'.
 * @property {string} extname       Extension name - '.hbs'.
 * @see {@link https://www.npmjs.com/package/express-hbs NPM:express-hbs}
 */

/**
 * @memberof module:config
 * @alias sass
 * @typedef {object} sass
 * @property {string} src   Path to source directory.
 * @property {string} dest  Path to destination directory.
 */

/**
 * @memberof module:config
 * @alias static
 * @typedef {object} static
 * @property {string} pub     Path to public folder.
 * @property {string} popper  Path to popper folder.
 * @property {string} bootstrap Path to bootstrap folder.
 * @property {string} jquery    Path to jquery folder.
 * @property {string} webfonts  Path webfonts directory.
 */

/**
 * @memberof module:config
 * @alias session
 * @typedef {object} session
 * @property {boolean} resave
 * @property {boolean} saveUninitialized
 * @property {object} cookie
 * @property {MongoStore} store
 * @see {@link https://www.npmjs.com/package/express-session NPM:express-session}
 */

/**
 * @memberof module:config
 * @alias MongoStore
 * @typedef {object} MongoStore
 * @property {string} url
 * @property {boolean} autoReconnect
 */

/**
 * @memberof module:config
 * @alias formidable
 * @typedef {object} formidable
 * @property {string} encoding
 * @property {string} uploadDir
 * @property {boolean} keepExtensions
 * @see {@link https://www.npmjs.com/package/formidable NPM:formidable}
 */

/**
 * @memberof module:config
 * @alias csrf
 * @typedef {object} lusca
 * @property {boolean} csrf
 * @property {string} xframe
 * @property {string} p3p
 * @property {hsts} hsts
 * @property {boolean} xssProtection
 * @property {boolean} nosniff
 * @property {string} referrerPolicy
 * @see {@link https://www.npmjs.com/package/lusca NPM:lusca}
 */

/**
 * @memberof module:config
 * @alias hsts
 * @typedef {object} hsts
 * @property {number} maxAge In milliseconds.
 * @property {boolean} includeSubDomains
 * @property {boolean} preload
 */

/**
 * @memberof module:config
 * @alias agenda
 * @typedef {object} agenda
 * @property {string} dbCollection
 * @property {number} pooltime
 * @property {number} concurrency
 * @see {@link https://www.npmjs.com/package/agenda NPM:agenda}
 */

/**
 * @memberof module:config
 * @alias agendash
 * @typedef {object} agendash
 * @property {string} user
 * @property {string} password
 * @see {@link https://www.npmjs.com/package/agendash NPM:agendash}
 */

/**
 * @memberof module:config
 * @alias mailjet
 * @typedef {object} mailjet
 * @property {string} apiKey
 * @property {string} domain
 * @see {@link https://www.npmjs.com/package/node-mailjet NPM:node-mailjet}
 */

/**
 * @memberof module:config
 * @alias configObject
 * @typedef {object} configObject
 * @property {string} envNode                   Environment mode: development, test, production.
 * @property {string} envHost                   Environment host.
 * @property {string} port                      Server port.
 * @property {string} dbURL               URL to database - MongoDB.
 * @property {mongooseOptions} mongooseOptions  Some mongoose options to avoid warnings.
 * @property {string} jwtSecret                 JWT secret - not used at the moment.
 * @property {string} dataFixer {@link https://fixer.io/documentation Fixer} api key.
 * @property {google} google                    Google api key and secret.
 * @property {logs} logs                        Logger information.
 * @property {string} views                     Path to view's folder.
 * @property {hbs} hbs                          HBS configuration.
 * @property {sass} sass                        SASS configuration.
 * @property {static} static                    Paths to static folders.
 * @property {session} session                  NPM:express-session configuration.
 * @property {formidable} formidable            NPM:formidable configuration.
 * @property {lusca} lusca                      NPM:lusca configuration.
 * @property {agenda} agenda                    NPM:agenda configuration.
 * @property {agendash} agendash                NPM:agendash configuration.
 * @property {mailjet} emails                   MailJet api keys.
 */

/**
 * @fileoverview Exports config object.
 *
 * @module config
 * @author Jaka Daneu
 * @requires NPM:app-root-path
 * @requires NPM:express-session
 * @requires NPM:connect-mongo(session)
 * @see {@link https://www.npmjs.com/package/app-root-path NPM:app-root-path}
 * @see {@link https://www.npmjs.com/package/express-session NPM:express-session}
 * @see {@link https://www.npmjs.com/package/connect-mongo NPM:connect-mongo}
 */

const srv = process.env.DB_SRV || process.env.DB_NAS_SRV || process.env.DB_ATLAS_SRV;
const user = process.env.DB_USER || process.env.DB_NAS_USER || process.env.DB_ATLAS_USER;
const pwd = process.env.DB_PWD || process.env.DB_NAS_PWD || process.env.DB_ATLAS_PWD;
const host = process.env.DB_HOST || process.env.DB_NAS_HOST || process.env.DB_ATLAS_HOST;
const name = process.env.DB_NAME || process.env.DB_NAS_NAME || process.env.DB_ATLAS_NAME;
const port = process.env.DB_PORT || process.env.DB_NAS_PORT || process.env.DB_ATLAS_PORT;
const auth = process.env.DB_AUTH || process.env.DB_NAS_AUTH || process.env.DB_ATLAS_AUTH;
const ssl = process.env.DB_SSL || process.env.DB_NAS_SSL || process.env.DB_ATLAS_SSL;
const rp = process.env.DB_RP || process.env.DB_NAS_RP || process.env.DB_ATLAS_RP;

/**
 * Config object.
 * @type {configObject}
 */
module.exports = {
  // running platform
  platform: process.platform,
  // Environment mode
  envNode: process.env.NODE_ENV,

  // Environment host
  envHost: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',

  // Environment port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT,

  // MongoDB url
  dbURL: process.env.DB_URL || process.env.DB_NAS_URL || process.env.DB_ATLAS_URL,
  db: {
    uri: process.env.DB_URL || process.env.DB_NAS_URL || process.env.DB_ATLAS_URL,
    srv,
    user,
    pwd,
    host,
    name,
    port,
    auth,
    ssl,
    rp
  },

  // Mongoose options
  mongooseOptions: {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  },

  // JWT secret sauce
  jwtSecret: process.env.JWT_SECRET,

  // data fixer api key
  dataFixer: process.env.DATA_FIXER_IO,

  // google api keys
  google: {
    id: process.env.GOOGLE_ID,
    secret: process.env.GOOGLE_SECRET
  },

  // winston logger level
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
    trace: process.env.LOG_TRACE === 'true' || false
  },

  // Api routes configuration
  api: {
    prefix: '/'
  },

  // views folder path
  views: appRoot.resolve('views'),

  // express-hbs configuration
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

  // sass configuration
  sass: {
    src: appRoot.resolve('public'),
    dest: appRoot.resolve('public')
  },

  // static folders paths
  static: {
    pub: appRoot.resolve('public'),
    popper: appRoot.resolve('node_modules/popper.js/dist/umd'),
    bootstrap: appRoot.resolve('node_modules/bootstrap/dist/js'),
    jquery: appRoot.resolve('node_modules/jquery/dist'),
    webfonts: appRoot.resolve(
      'node_modules/@fortawesome/fontawesome-free/webfonts'
    )
  },

  // express-session configuration
  session: {
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.DB_URL || process.env.DB_NAS_URL || process.env.DB_ATLAS_URL,
      autoReconnect: true
    })
  },

  // formidable configuration
  formidable: {
    encoding: 'utf-8',
    uploadDir: appRoot.resolve('/uploads'),
    keepExtensions: true
  },

  // lusca configuration
  lusca: {
    csrf: true,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: 'same-origin'
  },

  // Agenda configuration
  agenda: {
    dbCollection: process.env.AGENDANAME_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10)
  },

  // agendash configuration
  agendash: {
    user: 'agendash',
    password: '123456'
  },

  // mailjet api keys
  emails: {
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    domain: process.env.MJ_APIKEY_PRIVATE
  }
};
