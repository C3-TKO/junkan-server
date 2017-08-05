const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const HTTPStatus = require('http-status-codes');

chai.use(chaiHttp);

describe('Invalid routes', () => {

	describe('/GET/unknown-route', () => {
		it('should respond with a 404 error object', (done) => {
			chai.request(server)
				.get('/unknown-route')
				.end((err, res) => {
					res.should.have.status(HTTPStatus.NOT_FOUND);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
					res.body.should.eql(
            {
              type: 'about:blank',
              title: 'Not Found',
              status: HTTPStatus.NOT_FOUND,
            }
					);
					done();
				});
		});
	});
});


describe('Invalid input parameters', () => {
  describe('/GET/title/:invalid_url_syntax', () => {
    it('should respond with a 400 error object', (done) => {
      chai.request(server)
        .get('/title/htINVALIDtps%3A%2F%2Fwww.google.com')
        .end((err, res) => {
          assertErrorResponseSpecificationInvalidURLSyntax(res);
          done();
        });
    });
  });

  describe('/GET/html/:invalid_url_syntax', () => {
    it('should respond with a 400 error object', (done) => {
      chai.request(server)
        .get('/html/htINVALIDtps%3A%2F%2Fwww.google.com')
        .end((err, res) => {
          assertErrorResponseSpecificationInvalidURLSyntax(res);
          done();
        });
    });
  });

  describe('/GET/html/:#url_not_found', () => {
    it('should respond with a 502 error object', (done) => {
      chai.request(server)
        .get('/html/https%3A%2F%2Finvalid.domain')
        .end((err, res) => {
          assertErrorResponseSpecificationInvalidURLNotFound(res);
          done();
        });
    });
  });

  describe('/GET/title/:#url_not_found', () => {
    it('should respond with a 502 error object', (done) => {
      chai.request(server)
        .get('/title/https%3A%2F%2Finvalid.domain')
        .end((err, res) => {
          assertErrorResponseSpecificationInvalidURLNotFound(res);
          done();
        });
    });
  });

});

assertErrorResponseSpecificationInvalidURLSyntax = (res) => {
  res.should.have.status(HTTPStatus.BAD_REQUEST);
  res.headers['content-type'].should.equal('application/json; charset=utf-8');
  res.headers['content-language'].should.equal('en');
  res.body.should.eql(
    {
      type: 'about:blank',
      title: 'Bad Request',
      status: HTTPStatus.BAD_REQUEST,
      detail: 'Parameter url is invalid'
    }
  );
};

assertErrorResponseSpecificationInvalidURLNotFound = (res) => {
  res.should.have.status(HTTPStatus.BAD_GATEWAY);
  res.headers['content-type'].should.equal('application/json; charset=utf-8');
  res.headers['content-language'].should.equal('en');
  res.body.should.eql(
    {
      type: 'RequestError',
      title: HTTPStatus.getStatusText(HTTPStatus.BAD_GATEWAY),
      detail: 'Error: getaddrinfo ENOTFOUND invalid.domain invalid.domain:443',
      status: HTTPStatus.BAD_GATEWAY
    }
  );
}


