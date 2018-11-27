const profileRoute = require('./settings/profile');

module.exports.get = async (ctx) => {
  const { settingsLink } = ctx.params;
  let route = null;

  if (!ctx.isAuthenticated()) {
    ctx.redirect('/');
    return;
  }

  switch (settingsLink) {
  case 'password':
    route = 'password';
    break;
  default:
    route = profileRoute;
    break;
  }

  ctx.settingsLink = settingsLink;

  await route.get(ctx);
};
