import passport from 'passport';

const authTokenMiddleware = (req, res, next) => {
  passport.authenticate(
    'bearer',
    { session: false },
    (error, usuario) => {
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      if (!usuario) {
        return res.status(401).json({ message: 'Missing token' });
      }

      req.user = usuario;
      return next();
    },
  )(req, res, next);
};

export default authTokenMiddleware;
