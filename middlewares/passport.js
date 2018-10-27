const passport = require('koa-passport');
const compose = require('koa-compose');

module.exports = (app) => compose([
  passport.initialize(),
  passport.session(),
]);
