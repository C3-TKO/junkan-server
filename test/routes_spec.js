const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Routes', () => {

	/*
	 * Test the /GET route
	 */
	describe('/GET title', () => {
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

	/*
	 * Test the /GET route
	 */
	describe('/GET html', () => {
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