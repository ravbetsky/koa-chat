require('./User');
const mongoose = require('../libs/mongoose');
const _ = require('lodash');

const publicFields = ['name', 'id'];
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

roomSchema.methods.toJSON = function() {
  return _.pick(this.toObject(), publicFields);
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
