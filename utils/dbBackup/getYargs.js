const moment = require('moment');

const { argv } = require('yargs')
  .command(
    ['mongoexport [options]', 'me', 'export'],
    'Export MongoDB collection from specific database',
    yargs => {
      yargs.help();
    }
  )
  .command(
    ['mongoimport [options]', 'mi', 'import'],
    'Import MongoDB collection to specific database',
    yargs => {
      yargs
        .positional('folder', {
          describe:
            'Folder where json files are located [localhost, nas, atlas]',
          type: 'string',
          default: 'localhost',
          choices: ['localhost', 'nas', 'atlas'],
        })
        .help();
    }
  )
  .command(
    ['mongorestore [options]', 'mr', 'restore'],
    'Restore MongoDB database to specific datbase',
    yargs => {
      yargs
        .positional('folder', {
          describe: 'Folder where mongorestore dump files are.',
          type: 'string',
          default: `mongodump-${moment().format('YYYY-MM-DD')}`,
        })
        .help();
    }
  )
  .command(
    ['mongodump [options]', 'md', 'dump'],
    'Dump MongoDB database to folder',
    yargs => {
      yargs.positional('folder', {
        describe: 'Where to dump files',
        type: 'string',
        default: `mongodump-${moment().format('YYYY-MM-DD')}`,
      });
    }
  )
  .options({
    dbServer: {
      description: 'Server where database is running [localhost, nas, atlas]',
      type: 'string',
      default: 'localhost',
      choices: ['localhost', 'nas', 'atlas'],
    },
    logLevel: {
      description: 'Log level',
      type: 'string',
      default: 'debug',
      choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
    },
    collection: {
      description: 'Collections to use export/import',
      type: 'string',
      choices: ['currencies', 'expenses', 'rates', 'travels', 'users'],
      default: ['currencies', 'expenses', 'rates', 'travels', 'users'],
    },
    folder: {
      description: 'Where on local machine are collections imported from ',
      type: 'string',
      default: 'localhost',
      choices: ['localhost', 'nas', 'atlas'],
    },
  })
  .array('collection')
  .demandCommand(1)
  .help()
  .group('dbServer', 'Options')
  .group('logLevel', 'Options')
  .group('collection', 'Options')
  .group('folder', 'Specific options');

exports.argv = argv;
