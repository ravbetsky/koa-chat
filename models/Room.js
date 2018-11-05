require('./User');
const mongoose = require('../libs/mongoose');
const generate = require('nanoid/generate');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'У комнаты должно быть имя',
    unique: 'Комната с таким именем уже существует',
  },
  id: {
    type: String,
    unique: true,
  },
  isPrivate: Boolean,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);

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

createGeneral();

module.exports = Room;
