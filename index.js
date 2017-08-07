const express = require('express');
const HTTPStatus = require('http-status-codes');

const scraper = require('./app/routes/scraper');
const handleErrorResponse = require('./app/errorResponse');

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
app.use(handleErrorResponse);

app.listen(3000, () => {
  console.log('Junkan server is running on port 3000!');
});

module.exports = app;
