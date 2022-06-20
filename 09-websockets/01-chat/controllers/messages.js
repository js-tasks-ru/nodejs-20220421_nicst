const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = (await Message.find({chat: ctx.user.id}, ['date', 'text', 'id', 'user'], {
    limit: 20,
  })).map((d) => d.toClient());

  ctx.body = {messages};
};
