const UnauthorizedError = (message) => ({
  name: 'UnauthorizedError',
  status: 401,
  message,
});

export default UnauthorizedError;
