const Koa = require('koa');
const app = new Koa();

// Подключаем все необходимые мидлвары
const compose = require('koa-compose');
const middlewares = require('./middlewares');
app.use(compose(middlewares.map((middleware) => middleware(app))));

const Router = require('koa-router');
const router = new Router();

router.get('/', require('./routes/homepage').get);

router.post('/login', require('./routes/login').post);
router.post('/logout', require('./routes/logout').post);

app.use(router.routes());

module.exports = app;
