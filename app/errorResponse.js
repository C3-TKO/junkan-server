const HTTPStatus = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
function handleErrorResponse(err, req, res, next) {
  const responseObject =
    {
      title:
        err.message ||
        HTTPStatus.getStatusText((err.statusCode || HTTPStatus.INTERNAL_SERVER_ERROR)),
      status: err.statusCode || HTTPStatus.INTERNAL_SERVER_ERROR,
    };

  if (typeof err.detail !== 'undefined') {
    responseObject.detail = err.detail;
  }

  res.status(responseObject.status);
  res.send(responseObject);
}

module.exports = handleErrorResponse;
