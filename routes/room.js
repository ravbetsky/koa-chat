const Room = require('../models/Room');

module.exports.get = async (ctx, next) => {
  const { roomId } = ctx.params;
  if (ctx.isAuthenticated()) {
    // Проверить находится ли пользователь в комнате
    const currentRoom = await Room.findOne({ id: roomId });
    let isCurrentRoomAdmin = null;
    if (currentRoom.admin) {
      const userId = ctx.state.user._id.toString();
      const roomAdminId = currentRoom.admin.toString();
      isCurrentRoomAdmin = userId === roomAdminId;
    }
    ctx.body = ctx.render('dashboard.pug', {
      activeRoomId: roomId,
      isCurrentRoomAdmin,
      isGeneral: typeof isCurrentRoomAdmin !== 'boolean',
    });
  } else {
    ctx.flash('error', 'Пожалуйста войдите или зарегистрируйсесь');
    ctx.body = ctx.render('login.pug');
  }
};
