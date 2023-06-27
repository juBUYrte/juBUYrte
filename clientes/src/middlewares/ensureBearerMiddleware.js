import passport from 'passport';

const bearerMiddlaware = (req, res, next) => {
  passport.authenticate(
    'bearer',
    { session: false },
    (error, usuario) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      if (!usuario) {
        return res.status(401).json({ message: 'Missing token' });
      }

      req.user = usuario;
      return next();
    },
  )(req, res, next);
};

export default bearerMiddlaware;
