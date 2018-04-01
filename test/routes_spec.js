/* global describe, it, before, after */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const sinon = require('sinon');
const requestPromise = require('request-promise');
const bluebird = require('bluebird');

chai.should();
const HTTPStatus = require('http-status-codes');

chai.use(chaiHttp);

describe('Routes GET/', () => {
  // Mocking the inner requests of the scaper controller
  const fakeScrapedWebsite = bluebird.resolve('<html><head><title>GOVNO</title><body>GLUPOST</body></head></html>');

  before(() => {
    const scraperRequestStub = sinon.stub(requestPromise, 'get');
    scraperRequestStub.returns(fakeScrapedWebsite);
  });

  after(() => {
    requestPromise.get.restore();
  });

  describe('/GET /', () => {
    it('should GET the homepage of the junkan server', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(HTTPStatus.OK);
          done();
        });
    });
  });

  describe('/GET /title/:url', () => {
    it('should GET the title of a website', (done) => {
      chai.request(server)
        .get('/title/http%3A%2F%2Fwww.cevapsushi.de')
        .end((err, res) => {
          res.should.have.status(HTTPStatus.OK);
          res.headers['content-type'].should.equal('application/vnd.api+json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
          res.body.should.eql({
            data:
              {
                title: 'GOVNO',
              },
          });
          done();
        });
    });
  });

  describe('/GET /html/:url', () => {
    it('should GET the html code of a website', (done) => {
      chai.request(server)
        .get('/html/https%3A%2F%2Fwww.google.com')
        .end((err, res) => {
          const resultHTML =
            Buffer.from('<html><head><title>GOVNO</title><body>GLUPOST</body></head></html>').toString('base64');

          res.should.have.status(HTTPStatus.OK);
          res.headers['content-type'].should.equal('application/vnd.api+json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
          res.body.should.eql({
            data:
              {
                html: resultHTML,
              },
          });
          done();
        });
    });
  });
});
