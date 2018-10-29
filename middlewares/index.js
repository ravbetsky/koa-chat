const favicon = require('./favicon');
const errors = require('./errors');
const static = require('./static');
const logger = require('./logger');
const templates = require('./templates');
const session = require('./session');
const bodyParser = require('./bodyparser');
const passport = require('./passport');
const flash = require('./flash');
const rooms = require('./rooms');

module.exports = [
  favicon,
  static,
  logger,
  templates,
  errors,
  session,
  bodyParser,
  passport,
  flash,
  rooms,
];
