const session = require('koa-session');
const sessionStore = require('../libs/sessionStore');

module.exports = (app) => session({
  signed: false,
  store: sessionStore,
}, app);
