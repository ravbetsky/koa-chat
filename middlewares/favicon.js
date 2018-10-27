const favicon = require('koa-favicon');
const config = require('config');

module.exports = (app) => favicon(`${config.get('root')}/public/favicon.ico`);
