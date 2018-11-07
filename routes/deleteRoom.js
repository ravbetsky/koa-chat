const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');

module.exports.get = async (ctx, next) => {
  const { roomId } = ctx.params;
  const userId = ctx.state.user._id.toString();
  const room = await Room.findOne({ id: roomId });
  const roomAdminId = room.admin.toString();
  const roomObjectId = room._id;
  if (userId === roomAdminId) {
    try {
      const roomMessages = await Message.find({ room: roomObjectId });
      await Promise.all(roomMessages.map((message) => {
        return message.remove();
      }));
      // Оптимизорвать запрос
      const allUsers = await User.find({});
      const roomUsers = allUsers.filter((user) => {
        return user.rooms.some((room) =>
          room._id.toString() === roomObjectId.toString()
        );
      });
      await Promise.all(roomUsers.map((user) => {
        return user.update({ '$pull': { rooms: { $in: roomObjectId } } });
      }));
      await room.remove();
      ctx.flash('success', 'Комната удалена');
      ctx.redirect('/');
    } catch (e) {
      console.log(e);
    }
  } else {
    ctx.flash('error', 'Вы не являетесь администратором комнаты');
    ctx.redirect('/');
  }
};