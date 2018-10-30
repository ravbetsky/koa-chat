const uuid4 = require('uuid4');
module.exports = [{
  email: 'example1@home.ru',
  displayName: 'example1',
  verifiedEmail: true,
  verifyEmailToken: uuid4(),
  password: '123456',
}, {
  email: 'example2@home.ru',
  displayName: 'example2',
  verifiedEmail: true,
  verifyEmailToken: uuid4(),
  password: '123456',
}];
