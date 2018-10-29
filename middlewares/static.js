const serve = require('koa-static');
const compose = require('koa-compose');
const config = require('config');

const staticPaths = [
  serve('public'),
  serve(config.get('bootstrapRoot')),
  serve(config.get('jqueryRoot')),
];

module.exports = (app) => compose(staticPaths);
