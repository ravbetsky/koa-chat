require('./Room');
const mongoose = require('../libs/mongoose');
const crypto = require('crypto');
const config = require('config');
const _ = require('lodash');

const publicFields = ['displayName', 'email'];
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'E-mail пользователя не должен быть пустым.',
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        message: 'Некорректный email.',
      },
    ],
    unique: 'Такой email уже существует',
  },
  displayName: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует',
  },
  verifiedEmail: Boolean,
  verifyEmailToken: {
    type: String,
    unique: true,
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String,
  },
  providers: [{
    id: String,
    profile: {},
  }],
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
}, {
  timestamps: true,
});

userSchema.virtual('password').set(function(password) {
  if (password !== undefined) {
    if (password.length < 4) {
      this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
    }
  }
  // '123123' + 'ijfasdiofja849' => 'asdf8a7sdf897asd8f7asdf'
  this.salt = crypto
    .randomBytes(config.get('crypto.hash.length'))
    .toString('base64');

  this.passwordHash = crypto.pbkdf2Sync(
    password,
    this.salt,
    config.get('crypto.hash.iterations'),
    config.get('crypto.hash.length'),
    'sha512'
  ).toString('base64');
});

userSchema.methods.checkPassword = function(password) {
  if (!password) return false;

  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    config.get('crypto.hash.iterations'),
    config.get('crypto.hash.length'),
    'sha512'
  ).toString('base64');

  return hash === this.passwordHash;
};

userSchema.methods.toJSON = function() {
  return _.pick(this.toObject(), publicFields);
};

module.exports = mongoose.model('User', userSchema);
