const GitHubStrategy = require('passport-github').Strategy;
const config = require('config');
const Room = require('../../../models/Room');
const User = require('../../../models/User');

const CALLBACK_URL = `http://${config.get('app.host')}:${config.get('app.port')}/auth/github`;

module.exports = new GitHubStrategy({
  clientID: config.get('providers.github.appId'),
  clientSecret: config.get('providers.github.appSecret'),
  callbackURL: 'http://localhost:3000/auth/github',
  profileFields: ['email'],
}, function(accessToken, refreshToken, profile, done) {
  const email = profile.emails[0].value;

  User.findOne({ email }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      User.create({
        email,
        displayName: profile.displayName,
        providers: [{ id: 'github', profile }],
      }, async (err, user) => {
        if (err) return done(err);
        const generalRoom = await Room.findOne({ name: 'general' });
        user.rooms.push(generalRoom._id);
        await user.save();
        done(null, user, { message: 'Добро пожаловать!' });
      });
    } else {
      if (user.providers.find((provider) => provider.id === 'github')) {
        done(null, user, { message: 'Добро пожаловать!' });
      } else {
        user.providers.push({ id: 'github', profile });
        user.save((err) => {
          if (err) return done(err);

          done(null, user, { message: 'Добро пожаловать!' });
        });
      }
    }
  });
});
