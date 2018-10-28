const path = require('path');

module.exports = {
  secret: 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  bootstrapRoot: path.join(process.cwd(), 'node_modules/bootstrap/dist'),
  app: {
    port: 3000,
  },
  mongodb: {
    uri: 'mongodb://localhost/chat_app',
    debug: true,
  },
  crypto: {
    hash: {
      length: 128,
      iterations: 10,
    },
  },
};
