const Room = require('../../models/Room');
const generate = require('nanoid/generate');

const createGeneral = async () => {
  const generalChannel = await Room.findOne({ name: 'general' });
  if (!generalChannel) {
    return await Room.create({
      name: 'general',
      isPrivate: false,
      id: generate('1234567890', 8) },
    );
  }
  return;
};

module.exports = createGeneral;
