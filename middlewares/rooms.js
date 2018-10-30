const Room = require('../models/Room');

module.exports = (app) => async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    ctx.userRooms = await Promise.all(
      ctx.state.user.rooms.map((id) => Room.findById(id))
    );
  }
  await next();
};
