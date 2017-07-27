const request = require('request');

const cheerio = require('cheerio');

exports.get_title = (req, res) => {
  const url = decodeURI(req.params.url);
  const result = {
    title: '',
  };
  request.get(url, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      result.title = $('title').text();
    }

    res.send(result);
  });
};

exports.get_html = (req, res) => {
  const url = decodeURI(req.params.url);

  const result = {
    html: '',
  };

  request.get(url, (error, response, html) => {
    if (!error) {
      result.html = new Buffer(html).toString('base64');
    }

    res.send(result);
  });
};
