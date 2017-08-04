const requestPromise = require('request-promise');
const validator = require('validator');
const HTTPStatus = require('http-status-codes');
const cheerio = require('cheerio');

exports.get_title = (req, res, next) => {
  const url = validateURL(req, next);

  const result = {
    title: '',
  };
  requestPromise.get(url)
    .then((html) => {
      const $ = cheerio.load(html);
      result.title = $('title').text();

      res.send(result);
    })
    .catch((err) => {
      // Crawling failed...
      res.send(err);
    });
};

exports.get_html = (req, res, next) => {
  const url = validateURL(req, next);

  const result = {
    html: '',
  };

  requestPromise.get(url)
    .then((html) => {
      result.html = new Buffer(html).toString('base64');

      res.send(result);
    })
    .catch((err) => {
      // Crawling failed...
      res.send(err);
    });
};

validateURL = (req, next) => {
  const url = decodeURI(req.params.url);

  if (!validator.isURL(url)) {
    const err = new Error();
    err.statusCode = HTTPStatus.BAD_REQUEST;
    err.title = HTTPStatus.getStatusText(err.statusCode);
    err.detail = 'Parameter url is invalid';

    next(err);
  };

  return url;
};
