"use strict"

const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/', function (req, res) {
    res.send('Junkan server is up and running');
});

app.get('/title/:url', function (req, res) {
    var url = decodeURI(req.params.url);

    let result = {
        "title": ""
    };

    request(url, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(html);
            result.title = $('title').text();
        }

        res.send(result);
    });
});

app.get('/html/:url', function (req, res) {
    var url = decodeURI(req.params.url);

    let result = {
        "html": ""
    };

    request(url, function(error, response, html) {
        if(!error){
            result.html = new Buffer(html).toString('base64');
        }

        res.send(result);
    });
});

app.listen(3000, function () {
    console.log('Junkan server is running on port 3000!');
});
