const Room = require('../models/Room');

module.exports.get = async (ctx, next) => {
  const { roomId } = ctx.params;
  try {
    const room = await Room.findOne({ id: roomId });
    const roomObjectId = room._id;
    await ctx.state.user.update({ '$pull': { rooms: { $in: roomObjectId } } });
    ctx.flash('success', `You left room ${room.name}`);
    ctx.redirect('/');
  } catch (e) {
    console.log(e);
  }
};
