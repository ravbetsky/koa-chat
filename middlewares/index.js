const favicon = require('./favicon');
const errors = require('./errors');
const static = require('./static');
const logger = require('./logger');
const templates = require('./templates');
const session = require('./session');
const bodyParser = require('./bodyparser');
const passport = require('./passport');

module.exports = [
  favicon,
  static,
  logger,
  templates,
  errors,
  session,
  bodyParser,
  passport,
];
