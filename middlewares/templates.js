const pug = require('pug');
const path = require('path');
const config = require('config');

module.exports = (app) => async (ctx, next) => {
  ctx.locals = {
    get messages() {
      return ['Test alert'];
    },
  };

  ctx.render = function(templatePath, locals) {
    const fullPath = path.join(config.get('templatesRoot'), templatePath);
    return pug.renderFile(fullPath, Object.assign({}, ctx.locals, locals));
  };

  await next();
};
