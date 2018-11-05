const Room = require('../models/Room');
const generate = require('nanoid/generate');

module.exports.get = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('createRoom.pug');
  } else {
    ctx.flash('error', 'Пожалуйста войдите или зарегистрируйсесь');
    ctx.body = ctx.render('login.pug');
  }
};

module.exports.post = async (ctx, next) => {
  const { name, isPrivate } = ctx.request.body;
  if (ctx.isAuthenticated()) {
    try {
      const roomId = generate('1234567890', 8);
      const room = await Room.create({
        name,
        id: roomId,
        admin: ctx.state.user._id,
        isPrivate,
      });
      ctx.state.user.rooms.push(room);
      await ctx.state.user.save();
      ctx.flash('success', `Комната  ${room.name} создана`);
      ctx.redirect(`/room/${roomId}`);
    } catch (e) {
      console.log(e);
      ctx.throw(500, 'Something went wrong');
    }
  } else {
    ctx.flash('error', 'Пожалуйста войдите или зарегистрируйсесь');
    ctx.body = ctx.render('login.pug');
  }
};
