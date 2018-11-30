module.exports = {
  redis: {
    uri: process.env.REDIS_URL,
  },
  app: {
    port: process.env.PORT,
    uri: process.env.HEROKU_URL,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    debug: false,
  },
  providers: {
    github: {
      appId: '437e2def5431e00c083a',
      appSecret: '31d6f73dc927abfda8e1787a055f392d786a1c1b',
      passportOptions: {
        scope: ['emails', 'photos'],
      },
    },
    vk: {
      appId: '6767657',
      appSecret: 'UUhEnqfrZLR02A7RJmIC',
      passportOptions: {
        scope: ['emails', 'photos'],
      },
    },
  },
};
