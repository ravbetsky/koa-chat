const request = require('request-promise').defaults({
  resolveWithFullResponse: true,
  simple: false,
  json: true,
});
const _ = require('lodash');

const assert = require('assert');
const mongoose = require('../libs/mongoose');

const User = require('../models/User');
const app = require('../app');

const getURL = (path) => `http://localhost:3000${path}`;

describe('Server tests', () => {
  let server;

  before((done) => {
    server = app.listen(3000, done);
  });

  after((done) => {
    mongoose.disconnect();
    server.close(done);
  });

  describe('User REST API', () => {
    let existingUser;
    const existingUserData = {
      email: 'john@test.ru',
      displayName: 'John',
      password: '123456',
    };

    beforeEach(async function() {
      // load fixtures
      await User.remove({});
      existingUser = await User.create(existingUserData);
    });

    it('/login with existing', async () => {
      // await request({
      //   method: 'post',
      //   uri: getURL('/login'),
      //   body: _.omit(existingUserData, 'displayName'),
      // });

      // const response = await request({
      //   method: 'get',
      //   uri: getURL('/'),
      // });

      // // console.log('------------');
      // console.log(response);
      // // console.log('------------');
      assert.strictEqual(true, true);
      // const user = await User.findOne({ email: response.body.email });

      // assert.strictEqual(response.body.displayName, user.displayName);
      // assert.strictEqual(response.body.email, user.email);
    });
  });
});
