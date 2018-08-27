const { signToken } = require('./index');

module.exports = {
  signIn: (req, res) => {
    const token = signToken(req.user.id);
    res.json({ token });
  },
  validate: (req, res, next) => {
    if (req.user) {
      res.status(200).json({ message: 'Token is valid' });
    } else {
      next(new Error('Unable to find user with that token'));
    }
  },
};
