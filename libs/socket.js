const Cookies = require('cookies');
const config = require('config');
const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');

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
        // Если быстро перезагружать страницу
        // то не успевают удаляться айди сокетов
        const session = await sessionStore.get(sid);
        if (session) {
          session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
          await sessionStore.set(sid, session, null, { rolling: true });
        }
      } catch (e) {
        console.log(e);
      }
    });

    await next();
  });

  roomIO.on('connection', function(socket) {
    let activeRoomID;
    socket.on('join', function(roomid) {
      socket.join(roomid);
      roomIO.to(activeRoomID).emit('message', {
        type: 'system',
        content: `${socket.user.displayName} has joined to room`,
      });
      activeRoomID = roomid;
    });

    socket.on('leave', function(roomid) {
      socket.leave(roomid);
      socket.emit('disconnect');
    });

    socket.on('message', async function(msg) {
      if (activeRoomID) {
        const data = {
          author: socket.user.displayName,
          content: msg,
        };
        try {
          const message = await Message.create(data);
          const currentRoom = await Room.findOne({ id: activeRoomID });
          message.room = currentRoom._id;
          await message.save();
          const { author, content, createdAt } = message;
          roomIO.to(activeRoomID).emit('message', {
            type: 'user',
            author,
            content,
            createdAt,
          });
        } catch (e) {
          console.log(e);
        }
      }
    });
  });
};
