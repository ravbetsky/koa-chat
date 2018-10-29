module.exports.get = async (ctx, next) => {
  const { roomId } = ctx.params;
  if (ctx.isAuthenticated()) {
    // Проверить находится ли пользователь в комнате
    ctx.body = ctx.render('dashboard.pug', { activeRoomId: roomId });
  } else {
    ctx.flash('error', 'Пожалуйста войдите или зарегистрируйсесь');
    ctx.body = ctx.render('login.pug');
  }
};
