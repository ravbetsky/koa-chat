const User = require('../../models/User');

module.exports.get = async (ctx, next) => {
  const user = await User.findOne(ctx.state.user._id);
  const locals = {
    hasPassword: user.passwordHash !== null,
  };

  ctx.body = ctx.render('settings.pug', Object.assign({}, ctx.locals, locals));
};

module.exports.post = async (ctx, next) => {
  const user = await User.findOne(ctx.state.user._id);
  const { passwordNew,
    passwordConfirmNew,
    password: currentPassword,
  } = ctx.request.body;

  if (!!currentPassword && !user.checkPassword(currentPassword)) {
    ctx.flash('error', 'Неверный текущий пароль');
    return ctx.redirect(`/settings/${ctx.locals.settingsLink}/`);
  }

  if (passwordNew !== passwordConfirmNew) {
    ctx.flash('error', 'Пароли не совпадают');
    return ctx.redirect(`/settings/${ctx.locals.settingsLink}/`);
  }

  ctx.state.user.password = passwordNew;

  await ctx.state.user.save();
  ctx.flash('success', 'Пароль установлен');
  ctx.redirect(`/settings/${ctx.locals.settingsLink}/`);
};
