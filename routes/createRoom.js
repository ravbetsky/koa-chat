const Room = require('../models/Room');
const _ = require('lodash');
const generate = require('nanoid/generate');

module.exports.get = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('createRoom.pug');
  } else {
    ctx.flash('error', 'Please sign up or sign in');
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
      ctx.flash('success', `Room ${room.name} created`);
      ctx.redirect(`/room/${roomId}`);
    } catch (e) {
      if (e.name === 'ValidationError') {
        const errorMessages = _.keys(e.errors)
          .map((key) => `${key}: ${e.errors[key].message}`)
          .join('<br>');

        ctx.flash('error', errorMessages);
        return ctx.redirect('/createRoom');
      } else {
        throw e;
      }
    }
  } else {
    ctx.flash('error', 'Please sign up or sign in');
    ctx.body = ctx.render('login.pug');
  }
};
