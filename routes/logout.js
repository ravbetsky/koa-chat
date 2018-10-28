module.exports.post = async (ctx) => {
  ctx.logout();
  ctx.redirect('/');
};
