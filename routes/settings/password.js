module.exports.get = async (ctx, next) => {
  ctx.body = ctx.render('settings.pug', ctx.locals);
};
