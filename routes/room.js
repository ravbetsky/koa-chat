const Room = require('../models/Room');
const User = require('../models/User');
const getRoomUsers = require('../utils/getRoomUsers');

module.exports.get = async (ctx, next) => {
  const { roomId } = ctx.params;
  if (ctx.isAuthenticated()) {
    const currentRoom = await Room.findOne({ id: roomId });
    const locals = {};

    // Проверить находится ли пользователь в комнате
    const isUserInRoom = ctx.state.user.rooms.some((room) => {
      return room.toString() === currentRoom._id.toString();
    });

    if (isUserInRoom) {
      if (currentRoom.name !== 'general') {
        const adminUser = await User.findOne(currentRoom.admin);
        locals.adminEmail = adminUser.email;
      }
      let isCurrentRoomAdmin = null;
      if (currentRoom.admin) {
        const userId = ctx.state.user._id.toString();
        const roomAdminId = currentRoom.admin.toString();
        isCurrentRoomAdmin = userId === roomAdminId;
      }
      const roomUsers = await getRoomUsers(currentRoom._id);
      ctx.body = ctx.render('dashboard.pug', Object.assign({}, locals, {
        activeRoomId: roomId,
        activeRoomName: currentRoom.name,
        isCurrentRoomAdmin,
        isGeneral: typeof isCurrentRoomAdmin !== 'boolean',
        roomUsers: roomUsers.map((user) => user.toJSON()),
      }));
    } else {
      ctx.body = ctx.render('joinRoom.pug', Object.assign({}, locals, {
        roomName: currentRoom.name,
        roomId: currentRoom.id,
        roomObjectId: currentRoom._id.toString(),
      }));
    }
  } else {
    ctx.flash('error', 'Пожалуйста войдите или зарегистрируйсесь');
    ctx.body = ctx.render('login.pug');
  }
};
