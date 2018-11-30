module.exports.get = async (ctx, next) => {
  ctx.body = ctx.render('settings.pug', ctx.locals);
};

module.exports.post = async (ctx, next) => {
  const { displayName } = ctx.request.body;

  ctx.state.user.displayName = displayName;

  await ctx.state.user.save();

  ctx.flash('success', 'Display name changed');
  ctx.redirect(`/settings/${ctx.locals.settingsLink}/`);
};
