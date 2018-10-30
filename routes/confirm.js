const User = require('../models/User');

module.exports.get = async (ctx) => {
  const user = await User.findOne({
    verifyEmailToken: ctx.params.verifyEmailToken,
  });

  if (!user) {
    ctx.throw(404, 'Ссылка недействительна');
  }

  if (!user.verifiedEmail) {
    user.verifiedEmail = true;
  }

  await user.save();

  await ctx.login(user);

  ctx.redirect('/');
};
