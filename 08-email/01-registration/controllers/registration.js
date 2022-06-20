const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const {email, displayName, password} = ctx.request.body;
  const user = new User({
    email,
    displayName,
    verificationToken: token,
  });
  await user.setPassword(password);
  await user.save();
  await sendMail({
    template: 'confirmation',
    token,
    to: email,
    subject: 'registration email',
  });
  ctx.body = {
    status: 'ok',
  };
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  console.log(verificationToken);
  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {
      error: 'Ссылка подтверждения недействительна или устарела',
    };
    return;
  }
  user.verificationToken = undefined;
  await user.save();
  ctx.body = {
    token: uuid(),
  };
};
