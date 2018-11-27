module.exports.get = async (ctx, next) => {
  const locals = {
    settingsLink: ctx.settingsLink,
  };

  ctx.body = ctx.render('settings.pug', Object.assign({}, ctx.locals, locals));
};
