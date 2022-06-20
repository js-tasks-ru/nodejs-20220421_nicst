const mongoose = require('mongoose');
const connection = require('../libs/connection');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

});

messageSchema.method('toClient', function() {
  const obj = this.toObject();

  // Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = connection.model('Message', messageSchema);
