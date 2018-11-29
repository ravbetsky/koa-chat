const Cookies = require('cookies');
const config = require('config');
const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');

const socketIO = require('socket.io');
const redis = require('socket.io-redis');
const sessionStore = require('./sessionStore');

const asyncRedis = require('async-redis');
const redisClient = asyncRedis.createClient(config.get('redis.uri'));

redisClient.on('connect', function() {
  console.log('Redis client connected');
});

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
        await redisClient.srem(redisKey, socket.user.displayName);
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
      socket.emit('joined', socket.user.displayName);
      // roomIO.to(roomid).emit('message', {
      //   type: 'system',
      //   content: `${socket.user.displayName} has joined to room`,
      // });
      activeRoomID = roomid;
    });

    socket.on('leave', function(roomid) {
      socket.leave(roomid);
      socket.emit('disconnect');
    });

    socket.on('startTyping', async function() {
      const redisKey = `typing_${activeRoomID}`;
      let currentUsers = await redisClient.smembers(redisKey);

      if (!currentUsers.includes(socket.user.displayName)) {
        await redisClient.sadd(redisKey, socket.user.displayName);
        currentUsers = currentUsers.concat(socket.user.displayName);
      }

      roomIO.to(activeRoomID).emit('typing', currentUsers);
    });

    socket.on('stopTyping', async function() {
      const redisKey = `typing_${activeRoomID}`;
      const currentUsers = await redisClient.smembers(redisKey);

      if (currentUsers.includes(socket.user.displayName)) {
        await redisClient.srem(redisKey, socket.user.displayName);
        currentUsers.splice(currentUsers.indexOf(socket.user.displayName), 1);
      }

      roomIO.to(activeRoomID).emit('typing', currentUsers);
    });

    socket.on('message', async function(msg) {
      if (activeRoomID) {
        const data = {
          author: socket.user._id,
          content: msg,
        };
        try {
          const message = await Message.create(data);
          const currentRoom = await Room.findOne({ id: activeRoomID });
          message.room = currentRoom._id;
          await message.save();
          const { content, createdAt } = message;
          roomIO.to(activeRoomID).emit('message', {
            type: 'user',
            author: socket.user.displayName,
            avatar: socket.user.avatar,
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
