const Room = require('../models/Room');

module.exports.get = async (ctx, next) => {
  const { roomId } = ctx.params;
  try {
    const room = await Room.findOne({ id: roomId });
    const roomObjectId = room._id;
    await ctx.state.user.update({ '$push': { rooms: roomObjectId } });
    ctx.flash('success', 'You have been successfully joined the room');
    ctx.redirect(`/room/${roomId}`);
  } catch (e) {
    console.log(e);
  }
};
