const serve = require('koa-static');
const config = require('config');

module.exports = (app) => serve(`${config.get('root')}/public`);
