const serve = require('koa-static');
const compose = require('koa-compose');
const config = require('config');

const staticPaths = [
  serve('public'),
  serve(config.get('bootstrapRoot')),
];

module.exports = (app) => compose(staticPaths);
