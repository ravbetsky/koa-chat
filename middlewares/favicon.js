const favicon = require('koa-favicon');
const config = require('config');

module.exports = favicon(`${config.get('root')}/public/favicon.ico`);
