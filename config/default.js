const path = require('path');

module.exports = {
  secret: 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
  bootstrapRoot: path.join(process.cwd(), 'node_modules/bootstrap/dist'),
  fontAwesomeRoot: path.join(process.cwd(), 'node_modules/font-awesome'),
  socketRoot: path.join(process.cwd(), 'node_modules/socket.io-client/dist'),
  jqueryRoot: path.join(process.cwd(), 'node_modules/jquery/dist'),
  autocompleteRoot: path.join(process.cwd(),
    'node_modules/devbridge-autocomplete/dist'),
  underscoreRoot: path.join(process.cwd(), 'node_modules/underscore'),
  redis: {
    uri: 'redis://127.0.0.1:6379',
  },
  app: {
    port: process.env.PORT || 3000,
    host: 'http://localhost',
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
  providers: {
    github: {
      appId: 'd8b94a137cbce06a1f99',
      appSecret: '3ceb26bf022ee962f710292b8f4290b2245b4a0d',
      passportOptions: {
        scope: ['email'],
      },
    },
    vk: {
      appId: '6759095',
      appSecret: 'SNzsRcMySZNIfMZvwrhO',
      passportOptions: {
        scope: ['email'],
      },
    },
  },
  kitty: 'http://placekitten.com/g/32/32',
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
