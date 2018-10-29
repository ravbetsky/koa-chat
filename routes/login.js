const passport = require('../libs/passport');

module.exports.get = async (ctx, next) => {
  ctx.redirect('/');
};

module.exports.post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true, // ctx.flash()
  successFlash: true,
});
