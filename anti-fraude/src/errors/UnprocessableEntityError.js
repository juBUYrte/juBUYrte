const UnprocessableEntityError = (message) => ({
  name: 'UnprocessableEntityError',
  status: 404,
  message,
});

export default UnprocessableEntityError;
