const Cookies = require('cookies');
const config = require('config');
const User = require('../models/User');

const socketIO = require('socket.io');
const redis = require('socket.io-redis');
const sessionStore = require('./sessionStore');

module.exports = (server) => {
  const io = socketIO(server);

  io.adapter(redis(config.get('redis.uri')));

  roomIO = io.of('/room');

  roomIO.use(async function(socket, next) {
    const cookies = new Cookies(socket.request, {});
    const sid = cookies.get('koa:sess');

    if (!sid) {
      return next(new Error('Missing auth cookie'));
    }

    const session = await sessionStore.get(sid);

    if (!session) {
      return next(new Error('No session'));
    }

    if (!session.passport && !session.passport.user) {
      return next(new Error('Anonymous session not allowed'));
    }

    socket.user = await User.findById(session.passport.user);

    session.socketIds = session.socketIds
      ? session.socketIds.concat(socket.id)
      : [socket.id];

    await sessionStore.set(sid, session, null, { rolling: true });

    socket.on('disconnect', async function() {
      try {
        const session = await sessionStore.get(sid);
        if (session) {
          session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
          await sessionStore.set(sid, session, null, { rolling: true });
        }
      } catch (e) {
        console.log(e);
      }
    });

    next();
  });

  roomIO.on('connection', function(socket) {
    let activeRoomID;
    socket.on('join', function(roomid) {
      socket.join(roomid);
      roomIO.to(roomid).emit('testsocket', roomid);
      activeRoomID = roomid;
    });

    socket.on('message', function(msg) {
      if (activeRoomID) {
        roomIO.to(activeRoomID).emit('message', {
          author: socket.user.displayName,
          content: msg,
        });
      }
    });
  });
};
