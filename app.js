const Koa = require('koa');
const app = new Koa();

// Подключаем все необходимые мидллвары
const compose = require('koa-compose');
const middlewares = require('./middlewares');
app.use(compose(middlewares));

app.use(async (ctx, next) => {
  ctx.body = ctx.render('welcome.pug');
});

module.exports = app;
