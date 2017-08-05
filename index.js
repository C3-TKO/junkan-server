const express = require('express');
const HTTPStatus = require('http-status-codes');

const scraper = require('./app/routes/scraper');

const app = express();

// This middleware will be executed for every request to the app
// The api produces application/json only
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.header('Content-Language', 'en');
  next();
});

app.use('/', scraper);

// Final catch any route middleware used to raise 404
app.get('*', (req, res, next) => {
  const err = new Error();
  err.statusCode = HTTPStatus.NOT_FOUND;
  next(err);
});

// Error response handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const responseObject =
    {
      type: err.type || 'about:blank',
      title: err.message || HTTPStatus.getStatusText((err.statusCode || HTTPStatus.INTERNAL_SERVER_ERROR)),
      status: err.statusCode || HTTPStatus.INTERNAL_SERVER_ERROR,
    };

  if (typeof err.detail !== 'undefined') {
    responseObject.detail = err.detail;
  }

  res.status(responseObject.status);
  res.send(responseObject);
});

app.listen(3000, () => {
  console.log('Junkan server is running on port 3000!');
});

module.exports = app;
