const pug = require('pug');
const path = require('path');
const config = require('config');

module.exports = (app) => async (ctx, next) => {
  ctx.locals = {
    get user() {
      return ctx.state.user; // passport sets ctx
    },
    get rooms() {
      return ctx.getUserRooms;
    },
    get flash() {
      return ctx.getFlashMessages();
    },
  };

  ctx.render = function(templatePath, locals) {
    const fullPath = path.join(config.get('templatesRoot'), templatePath);
    return pug.renderFile(fullPath, Object.assign({}, ctx.locals, locals));
  };

  await next();
};
