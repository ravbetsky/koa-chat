const User = require('../models/User');

module.exports.get = async (ctx) => {
  const user = await User.findOne({
    verifyEmailToken: ctx.params.verifyEmailToken,
  });

  console.log(user);

  if (!user) {
    ctx.throw(404, 'Ссылка недействительна');
  }

  if (!user.verifiedEmail) {
    user.verifiedEmail = true;
  }

  user.verifyEmailToken = null;

  await user.save();

  await ctx.login(user);

  ctx.redirect('/');
};
