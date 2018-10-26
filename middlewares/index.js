const favicon = require('./favicon');
const errors = require('./errors');
const static = require('./static');
const logger = require('./logger');
const templates = require('./templates');

module.exports = [
  favicon,
  errors,
  static,
  logger,
  templates,
];
