const Message = require('../models/Message');
const Room = require('../models/Room');

module.exports.post = async (ctx, next) => {
  const { roomId } = ctx.request.body;
  const currentRoom = await Room.findOne({ id: roomId });
  const messages = await Message.find({ room: currentRoom._id });
  ctx.body = { messages };
};
