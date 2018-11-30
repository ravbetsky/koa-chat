const User = require('../models/User');

module.exports = async (roomId) => {
  const allUsers = await User.find({});
  return allUsers.filter((user) => {
    return user.rooms.some((room) =>
      room._id.toString() === roomId.toString()
    );
  });
};
