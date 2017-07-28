const requestPromise = require('request-promise');

const cheerio = require('cheerio');

exports.get_title = (req, res) => {
  const url = decodeURI(req.params.url);
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

exports.get_html = (req, res) => {
  const url = decodeURI(req.params.url);

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
