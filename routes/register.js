const config = require('config');
const _ = require('lodash');
const uuid4 = require('uuid4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.get = async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.redirect('/');
  } else {
    ctx.body = ctx.render('register.pug');
  }
};

module.exports.post = async (ctx) => {
  const {
    email,
    displayName,
    password,
    passwordConfirm,
  } = ctx.request.body;

  const verifyEmailToken = uuid4();

  if (password !== passwordConfirm) {
    ctx.flash('error', 'Пароли не совпадают');
    return ctx.redirect('/register');
  }

  try {
    await User.create({
      email,
      displayName,
      password,
      verifiedEmail: false,
      verifyEmailToken,
    });
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errorMessages = _.keys(e.errors)
        .map((key) => `${key}: ${e.errors[key].message}`)
        .join('<br>');

      ctx.flash('error', errorMessages);
      return ctx.redirect('/register');
    } else {
      throw e;
    }
  }

  const host = `${config.get('app.host')}:${config.get('app.port')}`;

  await sendMail({
    template: 'verify-registration-email',
    to: email,
    subject: 'Подтверждение email',
    link: `${host}/confirm/${verifyEmailToken}`,
  });

  ctx.body = ctx.render('registered.pug');
};
