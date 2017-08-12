const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const requestPromise = require('request-promise');
const bluebird = require('bluebird');
const should = chai.should();
const sinon = require('sinon');
const HTTPStatus = require('http-status-codes');
const handleErrorResponse = require('../app/errorResponse');

chai.use(chaiHttp);

describe('Invalid routes', () => {

	describe('/GET/unknown-route', () => {
		it('should respond with a 404 error object', (done) => {
			chai.request(server)
				.get('/unknown-route')
				.end((err, res) => {
					res.status.should.equal(HTTPStatus.NOT_FOUND);
          res.headers['content-type'].should.equal('application/vnd.api+json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
					res.body.should.eql(
            {
              errors:
              [
                {
                  title: 'Not Found',
                  status: HTTPStatus.NOT_FOUND,
                },
              ],
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


describe('Error response handling', () => {
  const res = {};
  res.send = sinon.spy();
  res.status = sinon.spy();

  beforeEach(() => {
    res.send.reset();
    res.status.reset();
  });

  it('should handle a defined HTTP Code', (done) => {
    const err =
      {
        statusCode: HTTPStatus.BAD_REQUEST,
      };

    handleErrorResponse(err, null, res, null);

    res.status.withArgs(HTTPStatus.BAD_REQUEST).calledOnce.should.equal(true);
    res.send.calledOnce;
    done();
  });

  it('should handle an undefined HTTP CODE', (done) => {
    const err =
      {
        statusCode: undefined,
      };

    handleErrorResponse(err, null, res, null);

    res.status.withArgs(HTTPStatus.INTERNAL_SERVER_ERROR).calledOnce.should.equal(true);
    res.send.calledOnce;
    done();
  });

  it('should handle error messages', (done) => {
    const err =
      {
        message: 'TEST',
      };

    const errorResponse =
      {
        errors:
        [
          {
            title: 'TEST',
            status: HTTPStatus.INTERNAL_SERVER_ERROR,
          },
        ],
      };

    handleErrorResponse(err, null, res, null);

    res.send.withArgs(errorResponse).calledOnce.should.equal(true);
    done();
  });

  it('should handle undefined error messages', (done) => {
    const err =
      {
        message: undefined,
      };

    const errorResponse =
      {
        errors:
        [
          {
            title: HTTPStatus.getStatusText(HTTPStatus.INTERNAL_SERVER_ERROR),
            status: HTTPStatus.INTERNAL_SERVER_ERROR,
          },
        ],
      };

    handleErrorResponse(err, null, res, null);

    res.send.withArgs(errorResponse).calledOnce.should.equal(true);
    done();
  });

  it('should handle error detail', (done) => {
    const err =
      {
        detail: 'TEST',
      };

    const errorResponse =
      {
        errors:
          [
            {
              title: HTTPStatus.getStatusText(HTTPStatus.INTERNAL_SERVER_ERROR),
              status: HTTPStatus.INTERNAL_SERVER_ERROR,
              detail: 'TEST',
            },
          ],
      };

    handleErrorResponse(err, null, res, null);

    res.send.withArgs(errorResponse).calledOnce.should.equal(true);
    done();
  });

  it('should handle undefined error detail', (done) => {
    const err = {};

    const errorResponse =
      {
        errors:
        [
          {
            title: HTTPStatus.getStatusText(HTTPStatus.INTERNAL_SERVER_ERROR),
            status: HTTPStatus.INTERNAL_SERVER_ERROR,
          },
        ],
      };

    handleErrorResponse(err, null, res, null);

    res.send.withArgs(errorResponse).calledOnce.should.equal(true);
    done();
  });
});



assertErrorResponseSpecificationInvalidURLSyntax = (res) => {
  res.should.have.status(HTTPStatus.BAD_REQUEST);
  res.headers['content-type'].should.equal('application/vnd.api+json; charset=utf-8');
  res.headers['content-language'].should.equal('en');
  res.body.should.eql(
    {
      errors:
      [
        {
          title: 'Bad Request',
          status: HTTPStatus.BAD_REQUEST,
          detail: 'Parameter url is invalid',
        },
      ],
    }
  );
};

describe('Internal request timeouts', () => {

  const expectedErrorStub ={error: {code: 'ESOCKETTIMEDOUT'}}

  // Mocking the inner requests of the scaper controller
  const timeoutedRequest = bluebird.reject(expectedErrorStub);

  before(function() {
    const scraperRequestStub = sinon.stub(requestPromise, 'get');
    scraperRequestStub.returns(timeoutedRequest);
  });

  after(function() {
    requestPromise.get.restore();
  });

  describe('/GET /html/:url', () => {
    it('should respond with a 504 error object', (done) => {
      chai.request(server)
        .get('/html/https%3A%2F%2Fwww.google.com')
        .end((err, res) => {
          res.status.should.equal(HTTPStatus.GATEWAY_TIMEOUT);
          res.headers['content-type'].should.equal('application/vnd.api+json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
          res.body.should.eql(
            {
              errors:
                [
                  {
                    title: HTTPStatus.getStatusText(HTTPStatus.GATEWAY_TIMEOUT),
                    status: HTTPStatus.GATEWAY_TIMEOUT,
                  },
                ],
            }
          );
          done();
        });
    });
  });

  describe('/GET /title/:url', () => {
    it('should respond with a 504 error object', (done) => {
      chai.request(server)
        .get('/title/https%3A%2F%2Fwww.google.com')
        .end((err, res) => {
          res.status.should.equal(HTTPStatus.GATEWAY_TIMEOUT);
          res.headers['content-type'].should.equal('application/vnd.api+json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
          res.body.should.eql(
            {
              errors:
                [
                  {
                    title: HTTPStatus.getStatusText(HTTPStatus.GATEWAY_TIMEOUT),
                    status: HTTPStatus.GATEWAY_TIMEOUT,
                  },
                ],
            }
          );
          done();
        });
    });
  });
});

assertErrorResponseSpecificationInvalidURLNotFound = (res) => {
  res.should.have.status(HTTPStatus.BAD_GATEWAY);
  res.headers['content-type'].should.equal('application/vnd.api+json; charset=utf-8');
  res.headers['content-language'].should.equal('en');
  res.body.should.eql(
    {
      errors:
      [
        {
          title: HTTPStatus.getStatusText(HTTPStatus.BAD_GATEWAY),
          status: HTTPStatus.BAD_GATEWAY,
        },
      ],
    }
  );
}


