require('./Room');
require('./User');
const mongoose = require('../libs/mongoose');
const _ = require('lodash');

const publicFields = ['author', 'content', 'createdAt'];
const messageSchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
}, {
  timestamps: true,
});

messageSchema.methods.toJSON = function() {
  return _.pick(this.toObject(), publicFields);
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
