const VKStrategy = require('passport-vkontakte').Strategy;
const config = require('config');
const uuid4 = require('uuid4');
const User = require('../../../models/User');
const Room = require('../../../models/Room');

const URI = `${config.get('app.uri')}`;
const CALLBACK_URL = `${URI}/oauth/vk`;

module.exports = new VKStrategy({
  clientID: config.get('providers.vk.appId'),
  clientSecret: config.get('providers.vk.appSecret'),
  callbackURL: CALLBACK_URL,
  scope: ['email'],
  profileFields: ['email', 'photos', 'displayName'],
}, function(accessToken, refreshToken, params, profile, done) {
  const email = params.email;
  const avatar = profile.photos
    ? profile.photos[0].value
    : config.get('kitty');

  User.findOne({ email }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      User.create({
        email,
        displayName: profile.displayName || `user${generate('12134567890', 6)}`,
        avatar,
        verifiedEmail: false,
        verifyEmailToken: uuid4(),
        providers: [{ id: 'vk', profile }],
      }, async (err, user) => {
        if (err) return done(err);
        const generalRoom = await Room.findOne({ name: 'general' });
        user.rooms.push(generalRoom._id);
        await user.save();
        done(null, user, { message: `Welcome ${user.displayName}!` });
      });
    } else {
      if (user.providers.find((provider) => provider.id === 'vk')) {
        done(null, user, { message: `Welcome ${user.displayName}!` });
      } else {
        user.providers.push({ id: 'vk', profile });
        user.save((err) => {
          if (err) return done(err);

          done(null, user, { message: `Welcome ${user.displayName}!` });
        });
      }
    }
  });
}
);
