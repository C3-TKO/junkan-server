const requestPromise = require('request-promise');
const validator = require('validator');
const HTTPStatus = require('http-status-codes');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs')

const REQUEST_TIMEOUT = 200;

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

const formatGatewayErr = (err) => {
  const statusCode = typeof err.error.code !== 'undefined' && err.error.code === 'ESOCKETTIMEDOUT'
    ? HTTPStatus.GATEWAY_TIMEOUT
    : HTTPStatus.BAD_GATEWAY;

  const errorResponse = Object.assign(
    err,
    {
      statusCode,
      message: HTTPStatus.getStatusText(statusCode),
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

    requestPromise.get({
      uri: url,
      timeout: REQUEST_TIMEOUT,
    }).then((html) => {
      const $ = cheerio.load(html);
      result.data.title = $('title').text();

      res.send(result);
    }).catch((err) => {
      next(formatGatewayErr(err));
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

    requestPromise.get({
      uri: url,
      timeout: REQUEST_TIMEOUT,
    }).then((html) => {
      result.data.html = Buffer.from(html).toString('base64');
      res.send(result);
    }).catch((err) => {
      // Crawling failed...
      next(formatGatewayErr(err));
    });
  } catch (err) {
    next(err);
  }
};

async function getPic(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto(url);
  await page.screenshot({path: 'google.png'});

  await browser.close();
}

exports.get_screenshot = (req, res, next) => {
  try {
    const url = validateURL(req);
    getPic(url);

    res.sendFile('google.png');


  } catch (err) {
    next(err);
  }
};
