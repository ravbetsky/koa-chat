const Room = require('../models/Room');

module.exports.post = async (ctx) => {
  const { query } = ctx.request.body;

  const rooms = await Room.find({ name: { $regex: query } });

  ctx.body = rooms.map((room) => room.toJSON());
};
