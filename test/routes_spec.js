const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const sinon = require('sinon');
const requestPromise = require('request-promise');
const bluebird = require('bluebird');
const should = chai.should();

chai.use(chaiHttp);

describe('Routes GET/', () => {
	// Mocking the inner requests of the scaper controller
	const fakeScrapedWebsite = bluebird.resolve('<html><head><title>GOVNO</title><body>GLUPOST</body></head></html>');

	before(function() {
		const scraperRequestStub = sinon.stub(requestPromise, 'get');
		scraperRequestStub.returns(fakeScrapedWebsite);
	});

	after(function() {
		requestPromise.get.restore();
	});

	describe('/GET /', () => {
		it('it should GET the homepage of the junkan server', (done) => {
			chai.request(server)
				.get('/')
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});

	describe('/GET /title/:url', () => {
		it('it should GET the title of a website', (done) => {
			chai.request(server)
				.get('/title/https%3A%2F%2Fwww.google.com')
				.end((err, res) => {
					res.should.have.status(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
					res.body.should.be.a('object');
					res.body.should.have.property('title');
          res.body.title.should.equal('GOVNO');
					done();
				});
		});
	});

	describe('/GET /html/:url', () => {
		it('it should GET the html code of a website', (done) => {
			chai.request(server)
				.get('/html/https%3A%2F%2Fwww.google.com')
				.end((err, res) => {
					res.should.have.status(200);
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          res.headers['content-language'].should.equal('en');
					res.body.should.be.a('object');
					res.body.should.have.property('html');
          res.body.html.should.equal(new Buffer('<html><head><title>GOVNO</title><body>GLUPOST</body></head></html>').toString('base64'));
					done();
				});
		});
	});

});