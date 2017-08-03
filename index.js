"use strict"

const express = require('express');
const HTTPStatus = require('http-status-codes');

var scraper = require('./app/routes/scraper');

const app = express();

app.use('/', scraper);

// Final catch any route middleware used to raise 404
app.get('*', (req, res, next) => {
  const err = new Error();
  err.status = HTTPStatus.NOT_FOUND;
  next(err);
});

// Error response handler
app.use((err, req, res, next) => {
  res.status(err.status);
  res.send(err.message || '** no unicorns here **');
});

app.listen(3000, function () {
    console.log('Junkan server is running on port 3000!');
});

module.exports = app;
