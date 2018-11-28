const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

// Reducing DB queries, by saving map
const memo = new Map();

module.exports.post = async (ctx, next) => {
  const { roomId } = ctx.request.body;
  const currentRoom = await Room.findOne({ id: roomId });
  const messagesDB = await Message.find({ room: currentRoom._id });
  const formatMessage = async function(msg) {
    const authorId = msg.author.toString();
    if (!memo.has(authorId)) {
      const author = await User.findOne(msg.author);
      memo.set(authorId, author.toJSON().displayName);
    }
    const author = { author: memo.get(authorId) };
    return Object.assign({}, msg.toJSON(), author);
  };

  const formattedMessages = await Promise.all(messagesDB.map(formatMessage));

  memo.clear();

  ctx.body = { messages: formattedMessages };
};
