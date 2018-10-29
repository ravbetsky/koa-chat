module.exports.get = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('dashboard.pug');
  } else {
    ctx.body = ctx.render('login.pug');
  }
};
