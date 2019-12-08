const appRoot = require('app-root-path');

const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

// TODO add datafixer
module.exports = {
  // Environment mode
  envNode: process.env.NODE_ENV,

  // Environment host
  envHost: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',

  // Environment port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT,

  // MongoDB url
  databaseURL: process.env.MONGODB_URI,

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
    level: process.env.LOG_LEVEL || 'silly'
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
      url: process.env.MONGODB_URI,
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
    dbCollection: process.env.AGENDA_DB_COLLECTION,
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
