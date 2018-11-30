const passport = require('koa-passport');
const User = require('../../models/User');

const localStrategy = require('./strategies/local');
const githubStrategy = require('./strategies/github');
const vkontakteStrategy = require('./strategies/vk');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

passport.use(localStrategy);
passport.use(githubStrategy);
passport.use(vkontakteStrategy);

module.exports = passport;
