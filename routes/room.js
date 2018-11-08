const Room = require('../models/Room');
const User = require('../models/User');
const getRoomUsers = require('../utils/getRoomUsers');

module.exports.get = async (ctx, next) => {
  const { roomId } = ctx.params;
  if (ctx.isAuthenticated()) {
    // Проверить находится ли пользователь в комнате
    const currentRoom = await Room.findOne({ id: roomId });
    const locals = {};
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
      isCurrentRoomAdmin,
      isGeneral: typeof isCurrentRoomAdmin !== 'boolean',
      roomUsers: roomUsers.map((user) => user.toJSON()),
    }));
  } else {
    ctx.flash('error', 'Пожалуйста войдите или зарегистрируйсесь');
    ctx.body = ctx.render('login.pug');
  }
};
