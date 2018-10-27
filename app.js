const Koa = require('koa');
const app = new Koa();

// Подключаем все необходимые мидлвары
const compose = require('koa-compose');
const middlewares = require('./middlewares');
app.use(compose(middlewares.map((middleware) => middleware(app))));

app.use(async (ctx, next) => {
  ctx.body = ctx.render('welcome.pug');
});

module.exports = app;
