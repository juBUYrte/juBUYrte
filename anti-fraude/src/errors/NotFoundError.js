const NotFoundError = (message) => ({
  name: 'NotFoundError',
  status: 404,
  message,
});

export default NotFoundError;
