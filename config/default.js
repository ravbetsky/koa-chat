const path = require('path');

module.exports = {
  secret: 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  bootstrapRoot: path.join(process.cwd(), 'node_modules/bootstrap/dist'),
  socketRoot: path.join(process.cwd(), 'node_modules/socket.io-client/dist'),
  jqueryRoot: path.join(process.cwd(), 'node_modules/jquery/dist'),
  redis: {
    uri: 'redis://127.0.0.1:6379',
  },
  app: {
    port: process.env.PORT || 3000,
    host: 'http:/localhost',
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
  mailer: {
    gmail: {
      user: 'test.chat.app73',
      password: 'testchatapp',
    },
    senders: {
      // transactional emails, register/forgot pass etc
      default: {
        fromEmail: 'info@amazingchat.com',
        fromName: 'Amazing Chat Team',
        signature: '<em>With regards</em>',
      },
    },
  },
};
