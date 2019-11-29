const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const { addLogger } = require('../config/logger');

const pathDepth = module.paths.length - 6;
const Logger = addLogger(__filename, pathDepth);

// TODO implement contact form

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  const unknownUser = !req.user;
  res.render('contact', {
    title: 'Contact',
    unknownUser
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res, next) => {
  Logger.debug('Posting contact');
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
      Logger.error(err);
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
