const pug = require('pug');
const path = require('path');
const config = require('config');

module.exports = async (ctx, next) => {
  ctx.render = function(templatePath, locals) {
    const fullPath = path.join(config.get('templatesRoot'), templatePath);
    console.log(fullPath)
    return pug.renderFile(fullPath, locals);
  };

  await next();
};
