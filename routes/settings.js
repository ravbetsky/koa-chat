const profileRoute = require('./settings/profile');
const passwordRoute = require('./settings/password');

const dispatch = (link) => {
  switch (link) {
  case 'password':
    return passwordRoute;
    break;
  default:
    return profileRoute;
    break;
  }
};

module.exports.get = async (ctx) => {
  const { settingsLink } = ctx.params;

  if (!ctx.isAuthenticated()) {
    ctx.redirect('/');
    return;
  }

  ctx.locals = Object.assign({}, ctx.locals, { settingsLink });

  await dispatch(settingsLink).get(ctx);
};

module.exports.post = async (ctx) => {
  const { settingsLink } = ctx.params;

  if (!ctx.isAuthenticated()) {
    ctx.redirect('/');
    return;
  }

  ctx.locals = Object.assign({}, ctx.locals, { settingsLink });

  await dispatch(settingsLink).post(ctx);
};
