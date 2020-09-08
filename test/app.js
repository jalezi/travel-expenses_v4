/* eslint-disable global-require */
const request = require('supertest');
const should = require('should');
const sinon = require('sinon');
require('sinon-mongoose');
const j = require('jsdom');

const { JSDOM } = j;

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
    done();
    // result.on('appStarted', () => {
    //   done();
    // });
  });
});

describe('--- Basic URL ---', () => {
  describe('GET /', () => {
    it('should return 200 OK', done => {
      agent.get('/').expect(200, done);
    });
  });

  describe('--- Route /login ---', () => {
    describe('GET /login', () => {
      it('should return 200 OK', done => {
        agent.get('/login').expect(200, done);
      });
    });

    // TODO find the way to send csrf
    describe('POST /login', () => {
      it('should return 302', done => {
        agent.get('/login')
          .expect(200)
          .end(async (err, res) => {
            if (err) return done(err);
            should.not.exist(err);
            const dom = new JSDOM(res.text);
            const $ = require('jquery')(dom.window);
            const csrf = $('input[name=_csrf]').val();
            should.exist(csrf);
            const cookie = res.headers['set-cookie'];
            should.exist(cookie);

            agent.post('/login')
              .type('form')
              .set('cookie', cookie)
              .send({ _csrf: csrf })
              .send({
                username: user.email,
                password: user.password
              })
              .expect(302)
              .end((err, res) => {
                console.dir(Object.entries(res.request._data));
                done();
              });
          });
      });
    });
  });

  describe('--- Route /signup ---', () => {
    describe('GET /signup', () => {
      it('should return 200 OK', done => {
        agent.get('/signup').expect(200, done);
      });
    });

    describe('POST /signup', () => {
      it('should return 302', done => {
        agent.get('/signup')
          .expect(200)
          .end(async (err, res) => {
            if (err) return done(err);
            should.not.exist(err);
            const dom = new JSDOM(res.text);
            const $ = require('jquery')(dom.window);
            const csrf = $('input[name=_csrf]').val();
            should.exist(csrf);
            const cookie = res.headers['set-cookie'];
            should.exist(cookie);

            agent.post('/signup')
              .type('form')
              .set('cookie', cookie)
              .send({ _csrf: csrf })
              .expect(302)
              .end((err, res) => {
                console.dir(Object.entries(res.request._data));
                done();
              });
          });
      });
    });
  });

  describe('--- Route /contact ---', () => {
    describe('GET /contact', () => {
      it('should return 200 OK', done => {
        agent.get('/contact').expect(200, done);
      });
    });

    describe('POST /contact', () => {
      it('should return 302', done => {
        agent.get('/contact')
          .expect(200)
          .end(async (err, res) => {
            if (err) return done(err);
            should.not.exist(err);
            const dom = new JSDOM(res.text);
            const $ = require('jquery')(dom.window);
            const csrf = $('input[name=_csrf]').val();
            should.exist(csrf);
            const cookie = res.headers['set-cookie'];
            should.exist(cookie);
            agent.post('/contact')
              .type('form')
              .set('cookie', cookie)
              .send({ _csrf: csrf })
              .send({ name: 'John Doe' })
              .send({ email: 'test@example.com' })
              .send({ message: 'This is dummy message!' })
              .expect(302)
              .end((err, res) => {
                console.dir(Object.entries(res.request._data));
                done();
              });
          });
      });
    });
  });
});

describe('--- USER SPECIFIC URL ---', () => {
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
});

describe('--- MISCELLANEOUS URL ---', () => {
  describe('GET /random-url', () => {
    it('should return 404', done => {
      agent.get('/reset').expect(404, done);
    });
  });
});

exports.agent = agent;

exports.appResolved = appResolved;
