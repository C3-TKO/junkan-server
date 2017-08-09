const HTTPStatus = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
function handleErrorResponse(err, req, res, next) {
  const title =
    err.message ||
    HTTPStatus.getStatusText((err.statusCode || HTTPStatus.INTERNAL_SERVER_ERROR));
  const status = err.statusCode || HTTPStatus.INTERNAL_SERVER_ERROR;

  const responseObject =
    {
      errors:
      [
        {
          title,
          status,
        },
      ],

    };

  if (typeof err.detail !== 'undefined') {
    responseObject.errors[0].detail = err.detail;
  }

  res.status(status);
  res.send(responseObject);
}

module.exports = handleErrorResponse;
