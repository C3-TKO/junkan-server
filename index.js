"use strict"

const express = require('express');

var scraper = require('./routes/scraper');

const app = express();

app.use('/', scraper);

app.listen(3000, function () {
    console.log('Junkan server is running on port 3000!');
});
