const expressHbs = require('express-hbs');

expressHbs.registerHelper('flash', (message) => {
  if (message.error) {

  }
  if (message.info) {

  }
if (message.success) {
  
}

})
