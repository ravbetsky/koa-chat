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
      await room.remove();
      const roomMessages = await Message.find({ room: roomObjectId });
      await Promise.all(roomMessages.map((message) => {
        return message.remove();
      }));
      const roomUsers = await User.find((user) => {
        return user.rooms.includes(roomObjectId);
      });
      await Promises.all(roomUsers.map((user) => {
        return user.rooms.splice(roomObjectId, 1);
      }));
      await Promises.all(roomMessages.map(async (message) => {
        return await message.remove();
      }));
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
