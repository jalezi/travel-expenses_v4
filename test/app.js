const request = require('supertest');
const app = require('../app.js');

const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const User = require('../models/User');
const Travel = require('../models/Travel');

const UserMock = sinon.mock(new User({ email: 'test@gmail.com', password: 'root', travels: []}));
const user = UserMock.object;
const TravelMock = sinon.mock(new Travel({_user: user._id, description: 'travel1', dateFrom: new Date('2019-05-01'), dateTo: new Date('2019-05-1'), perMileAmount: user.perMileAmount}));
const travel = TravelMock.object;
console.log(user);
console.log(travel);

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /contact', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /import', () => {
  it('should return 200 OK', (done) => {
    app.request.user = user;
    request(app)
      .get('/import')
      .expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});
