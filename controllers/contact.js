const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const LoggerClass = require('../config/LoggerClass');

const Logger = new LoggerClass('contact');
const { mainLogger, logger } = Logger;
mainLogger.debug('controllers\\contact INITIALIZING!');

/**
 * Contact routes.
 * @module controllers/contact
 * @requires NPM:node-mailjet
 * @requires module:config/LoggerClass
 * @see {@link https://www.npmjs.com/package/node-mailjet NPM:node-mailjet}
 */

/**
 * GET /contact
 *
 * Contact form page.
 * @memberof module:controllers/contact
 * @alias getContact
 * @param {http.request} req
 * @param {http.response} res
 */
exports.getContact = (req, res) => {
  logger.debug('Geting contact form');
  const unknownUser = !req.user;
  res.render('contact', {
    title: 'Contact',
    unknownUser
  });
};

/**
 * POST /contact
 *
 * Sends a contact form via MailJet.
 * @memberof module:controllers/contact
 * @alias postContact
 * @param {http.request} req
 * @param {http.response} res
 * @param {function} next
 */
exports.postContact = (req, res, next) => {
  logger.debug('Posting contact form');
  let fromName;
  let fromEmail;
  if (!req.user) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
  }
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  if (!req.user) {
    fromName = req.body.name;
    fromEmail = req.body.email;
  } else {
    fromName = req.user.profile.name || '';
    fromEmail = req.user.email;
  }

  const sendContactForm = async () => {
    const sendEmail = mailjet.post('send', { version: 'v3.1' });
    const emailData = {
      Messages: [
        {
          From: {
            Email: 'jaka.daneu@siol.net',
            Name: `${fromName} - ${fromEmail}`
          },
          To: [
            {
              Email: 'jakad@me.com',
              Name: 'TExpenses App'
            }
          ],
          Subject: 'Contact TExpenses App',
          TextPart: req.body.message
        }
      ]
    };

    try {
      await sendEmail.request(emailData);
      return req.flash('info', {
        msg: 'An e-mail has been sent to TExpenses App.'
      });
    } catch (err) {
      logger.error(err.message);
      req.flash('errors', {
        msg: 'Error sending the contact message. Please try again shortly.'
      });
      return err;
    }
  };

  sendContactForm()
    .then(() => {
      res.redirect('/');
    })
    .catch(next);
};
