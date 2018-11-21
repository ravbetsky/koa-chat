const Koa = require('koa');
const app = new Koa();
const config = require('config');
const passport = require('passport');

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
router.post('/searchRooms', require('./routes/searchRooms').post);
router.get('/deleteRoom/:roomId', require('./routes/deleteRoom').get);
router.get('/leaveRoom/:roomId', require('./routes/leaveRoom').get);
router.get('/joinRoom/:roomId', require('./routes/joinRoom').get);
router.post('/messages', require('./routes/messages').post);

// Github passport auth
const githubPassportOptions = config.get('providers.github.passportOptions');
router.get('/login/github', passport.authenticate('github', githubPassportOptions));
router.get('/auth/github', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/',
  successFlash: true,
  failureFlash: true,
}));

app.use(router.routes());

module.exports = app;
