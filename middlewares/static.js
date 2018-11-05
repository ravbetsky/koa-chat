const serve = require('koa-static');
const compose = require('koa-compose');
const config = require('config');

const staticPaths = [
  serve('public'),
  serve(config.get('bootstrapRoot')),
  serve(config.get('jqueryRoot')),
  serve(config.get('socketRoot')),
  serve(config.get('fontAwesomeRoot')),
];

module.exports = (app) => compose(staticPaths);
