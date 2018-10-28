const passport = require('../libs/passport');

module.exports.post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true, // ctx.flash()
  successFlash: true,
});
