import passport from 'passport';

const bearerMiddleware = (req, res, next) => {
  passport.authenticate(
    'bearer',
    { session: false },
    (error, usuario) => {
      if (error?.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (error) {
        return res.status(500).json({ message: error.message });
      }

      req.user = usuario;
      return next();
    },
  )(req, res, next);
};

export default bearerMiddleware;
