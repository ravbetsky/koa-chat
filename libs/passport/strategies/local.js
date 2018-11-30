const LocalStrategy = require('passport-local');
const User = require('../../../models/User');

const messages = {
  'not-found': 'No such user or wrong password',
  'welcome': 'Welcome!',
};

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  function(email, password, done) {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, { message: messages['not-found'] });
      }
      return done(null, user, { message: messages['welcome'] });
    });
  }
);
