const request = require('supertest');
let { app } = require('../app.js');
const User = require('../models/User');

let agent;
let appResolved;

const user = new User({
  email: 'test@gmail.com',
  password: 'root',
  travels: []
});

before(done => {
  app.then(result => {
    agent = request(result);
    appResolved = result;
    result.on('appStarted', () => {
      done();
    });
  });
});

describe('GET /', () => {
  it('should return 200 OK', done => {
    agent.get('/').expect(200, done);
  });
});

describe('GET /login', () => {
  it('should return 200 OK', done => {
    agent.get('/login').expect(200, done);
  });
});

describe('GET /signup', () => {
  it('should return 200 OK', done => {
    agent.get('/signup').expect(200, done);
  });
});

describe('GET /contact', () => {
  it('should return 200 OK', done => {
    agent.get('/contact').expect(200, done);
  });
});

describe('GET /import', () => {
  it('should return 200 OK', done => {
    appResolved.request.user = user;
    agent.get('/import').expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', done => {
    agent.get('/reset').expect(404, done);
  });
});
