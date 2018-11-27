const profileRoute = require('./settings/profile');
const passwordRoute = require('./settings/password');

module.exports.get = async (ctx) => {
  const { settingsLink } = ctx.params;
  let route = null;

  if (!ctx.isAuthenticated()) {
    ctx.redirect('/');
    return;
  }

  switch (settingsLink) {
  case 'password':
    route = passwordRoute;
    break;
  default:
    route = profileRoute;
    break;
  }

  ctx.locals = Object.assign({}, ctx.locals, { settingsLink });

  await route.get(ctx);
};
