const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  let user = new User({email, displayName});
  const err = user.validateSync();
  if (err) {
    done(err, false);
    return;
  }

  user = await User.findOne({email});
  if (user) {
    done(null, user);
  } else {
    user = new User({
      email,
      displayName,
    });
    user = await user.save();
    done(null, user);
  }
};
