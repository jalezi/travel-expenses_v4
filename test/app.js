const request = require('supertest');
const sinon = require('sinon');
require('sinon-mongoose');

let { app } = require('../app.js');
const User = require('../models/User');
const Travels = require('../models/Travel');
const Expense = require('../models/Expense');
const Currency = require('../models/Currency');

let agent;
let appResolved;

const user = new User({
  email: 'test@gmail.com',
  password: 'root',
  travels: [],
});

const travel = new Travels({
  _user: user._id,
  description: 'New Travel',
  dateFrom: new Date(),
  dateTo: new Date(),
  homeCurrency: 'USD',
  expenses: []
});

const currency = new Currency({
  base: 'USD',
  date: travel.dateFrom,
  rate: {}
});
currency.rate.USD = 1;

const expense = new Expense({
  travel: travel._id,
  _user: user._id,
  description: 'New Expense',
  type: 'Flight',
  date: travel.dateFrom,
  currency: 'USD',
  curRate: currency._id,
  amount: 100,
  amountConverted: 100,
  expenses: []
});


travel.expenses.push(expense._id);
user.travels.push(travel._id);

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

describe('GET /account', () => {
  it('should return 200 OK', done => {
    appResolved.request.user = user;
    agent.get('/account').expect(200, done);
  });
});

describe('GET /import', () => {
  it('should return 200 OK', done => {
    appResolved.request.user = user;
    agent.get('/import').expect(200, done);
  });
});

describe('GET /travels', () => {
  it('should return 200 OK', done => {
    appResolved.request.user = user;
    agent.get('/travels').expect(200, done);
  });
});

describe('GET /travels/:id', () => {
  it('should return 200 OK', done => {
    appResolved.request.user = user;
    const UserMock = sinon.mock(travel);
    const travelObject = UserMock.object;
    travelObject.save();
    appResolved.request.travel = travelObject;

    agent.get(`/travels/${travelObject._id}`).expect(200, done);
  });
});

describe('GET /travels/:id/expenses/:id', () => {
  it('should return 200 OK', done => {
    appResolved.request.user = user;
    const TravelMock = sinon.mock(travel);
    const travelObject = TravelMock.object;
    travelObject.save();

    const CurRateMock = sinon.mock(currency);
    const curRateObject = CurRateMock.object;
    curRateObject.save();

    const ExpenseMock = sinon.mock(expense);
    const expenseObject = ExpenseMock.object;
    expenseObject.save();
    appResolved.request.travel = travelObject;
    appResolved.request.expense = expenseObject;

    agent.get(`/travels/${travelObject._id}/expenses/${expenseObject._id}`).expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', done => {
    agent.get('/reset').expect(404, done);
  });
});
