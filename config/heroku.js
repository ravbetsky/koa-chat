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
};