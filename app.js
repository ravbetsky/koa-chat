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
router.get('/login', require('./routes/login').get);
router.get('/logout', require('./routes/logout').get);
router.get('/register', require('./routes/register').get);
router.post('/register', require('./routes/register').post);
router.get('/confirm/:verifyEmailToken', require('./routes/confirm').get);

router.get('/room/:roomId', require('./routes/room').get);
router.post('/createRoom', require('./routes/createRoom').post);
router.get('/createRoom', require('./routes/createRoom').get);
router.get('/deleteRoom/:roomId', require('./routes/deleteRoom').get);
router.post('/messages', require('./routes/messages').post);

app.use(router.routes());

module.exports = app;
