module.exports.get = async (ctx) => {
  ctx.logout();
  ctx.redirect('/');
};
