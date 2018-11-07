const User = require('../../models/User');
const Room = require('../../models/Room');
const mongoose = require('../../libs/mongoose');
const users = require('./users');
const createGeneral = require('./general');

(async () => {
  try {
    await createGeneral();
    const generalRoom = await Room.findOne({ name: 'general' });
 
    for (let i = 0; i < users.length; i++) {
      const user = await User.create(users[i]);
      user.rooms.push(generalRoom._id);
      await user.save();
    }
    console.log(`All done, ${users.length} users have been saved in DB`);
  } catch (e) {
    console.log(e);
  }

  mongoose.disconnect();
})();
