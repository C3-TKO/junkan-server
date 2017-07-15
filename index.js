"use strict"

const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

var scraper = require('./routes/scraper');

const app = express();

app.use('/', scraper);

app.listen(3000, function () {
    console.log('Junkan server is running on port 3000!');
});
