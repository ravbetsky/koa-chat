const GitHubStrategy = require('passport-github').Strategy;
const config = require('config');
const uuid4 = require('uuid4');
const Room = require('../../../models/Room');
const User = require('../../../models/User');
const generate = require('nanoid/generate');

const URI = `${config.get('app.uri')}`;
const CALLBACK_URL = `${URI}/auth/github`;

module.exports = new GitHubStrategy({
  clientID: config.get('providers.github.appId'),
  clientSecret: config.get('providers.github.appSecret'),
  callbackURL: CALLBACK_URL,
  scope: 'user:email',
  profileFields: ['emails', 'photos', 'displayName'],
}, function(accessToken, refreshToken, profile, done) {
  const email = profile.emails[0].value;
  const avatar = profile.photos
    ? profile.photos[0].value
    : config.get('kitty');

  User.findOne({ email }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      User.create({
        email,
        avatar,
        displayName: profile.displayName || `user${generate('12134567890', 6)}`,
        verifiedEmail: false,
        verifyEmailToken: uuid4(),
        providers: [{ id: 'github', profile }],
      }, async (err, user) => {
        if (err) return done(err);
        const generalRoom = await Room.findOne({ name: 'general' });
        user.rooms.push(generalRoom._id);
        await user.save();
        done(null, user, { message: `Welcome ${user.displayName}!` });
      });
    } else {
      if (user.providers.find((provider) => provider.id === 'github')) {
        done(null, user, { message: `Welcome ${user.displayName}!` });
      } else {
        user.providers.push({ id: 'github', profile });
        user.save((err) => {
          if (err) return done(err);

          done(null, user, { message: `Welcome ${user.displayName}!` });
        });
      }
    }
  });
});
