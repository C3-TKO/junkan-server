const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Routes', () => {

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
					res.body.should.be.a('object');
					res.body.should.have.property('title');
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
					res.body.should.be.a('object');
					res.body.should.have.property('html');
					done();
				});
		});
	});

});