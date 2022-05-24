const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

const INCORRECT_PASSWORD = 'Неверный пароль';
const USER_DOESNOT_EXIST = 'Нет такого пользователя';

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        done(null, false, USER_DOESNOT_EXIST);
        return;
      }
      if (!await user.checkPassword(password)) {
        done(null, false, INCORRECT_PASSWORD);
      } else {
        done(null, user);
      }
    },
);
