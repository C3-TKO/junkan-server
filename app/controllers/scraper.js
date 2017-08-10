const requestPromise = require('request-promise');
const validator = require('validator');
const HTTPStatus = require('http-status-codes');
const cheerio = require('cheerio');

const validateURL = (req) => {
  const url = decodeURI(req.params.url);

  if (validator.isURL(url)) {
    return url;
  }

  const err = new Error();
  err.statusCode = HTTPStatus.BAD_REQUEST;
  err.mesaage = HTTPStatus.getStatusText(err.statusCode);
  err.detail = 'Parameter url is invalid';

  throw err;
};

const formatBadGatewayErr = (err) => {
  const errorResponse = Object.assign(err,
    {
      statusCode: HTTPStatus.BAD_GATEWAY,
      detail: err.message,
      message: HTTPStatus.getStatusText(HTTPStatus.BAD_GATEWAY),
    },
  );
  return errorResponse;
};

exports.get_title = (req, res, next) => {
  try {
    const url = validateURL(req);

    const result = {
      data: {
        title: '',
      },
    };
    requestPromise.get(url)
      .then((html) => {
        const $ = cheerio.load(html);
        result.data.title = $('title').text();

        res.send(result);
      })
      .catch((err) => {
        next(formatBadGatewayErr(err));
      });
  } catch (err) {
    next(err);
  }
};

exports.get_html = (req, res, next) => {
  try {
    const url = validateURL(req);

    const result = {
      data:
        {
          html: '',
        },
    };

    requestPromise.get(url)
      .then((html) => {
        result.data.html = new Buffer(html).toString('base64');

        res.send(result);
      })
      .catch((err) => {
        // Crawling failed...
        next(formatBadGatewayErr(err));
      });
  } catch (err) {
    next(err);
  }
};
