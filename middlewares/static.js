const serve = require('koa-static');
const compose = require('koa-compose');
const config = require('config');

const staticPaths = [
  serve('public'),
  serve(config.get('bootstrapRoot')),
  serve(config.get('jqueryRoot')),
  serve(config.get('socketRoot')),
  serve(config.get('fontAwesomeRoot')),
  serve(config.get('autocompleteRoot')),
  serve(config.get('underscoreRoot')),
];

module.exports = (app) => compose(staticPaths);
