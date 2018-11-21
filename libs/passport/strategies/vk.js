const VKStrategy = require('passport-vkontakte').Strategy;
const config = require('config');
const User = require('../../../models/User');
const Room = require('../../../models/Room');

// const CALLBACK_URL = `http://${config.get('app.host')}:${config.get('app.port')}/oauth/vk`;

module.exports = new VKStrategy({
  clientID: config.get('providers.vk.appId'),
  clientSecret: config.get('providers.vk.appSecret'),
  callbackURL: 'http://localhost:3000/oauth/vk',
  scope: ['email'],
  profileFields: ['email'],
}, function(accessToken, refreshToken, params, profile, done) {
  const email = params.email;

  User.findOne({ email }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      User.create({
        email,
        displayName: profile.displayName,
        providers: [{ id: 'vk', profile }],
      }, async (err, user) => {
        if (err) return done(err);
        const generalRoom = await Room.findOne({ name: 'general' });
        user.rooms.push(generalRoom._id);
        await user.save();
        done(null, user, { message: 'Добро пожаловать!' });
      });
    } else {
      if (user.providers.find((provider) => provider.id === 'vk')) {
        done(null, user, { message: 'Добро пожаловать!' });
      } else {
        user.providers.push({ id: 'vk', profile });
        user.save((err) => {
          if (err) return done(err);

          done(null, user, { message: 'Добро пожаловать!' });
        });
      }
    }
  });
}
);
