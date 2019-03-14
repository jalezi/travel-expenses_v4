const expressHbs = require('express-hbs');
const moment = require('moment');

expressHbs.registerHelper('flash', (message) => {
  if (message.error) {
    return message.error;
  }
  if (message.info) {
    return message.info;
  }
  if (message.success) {
    return message.success;
  }

})

// expressHbs.registerHelper('gravatar', (user) => {
//   return user.gravatar(60);
// })

expressHbs.registerHelper('debug', function(data, breakpoint) {
  console.log(data);
  if (breakpoint === true) {
    debugger;
  }
  return '';
});

expressHbs.registerHelper('gender', (userGender, radioButtonGender) => {
  return userGender == radioButtonGender;
})

expressHbs.registerHelper ("setChecked", function (value, currentValue) {

    if ( value == currentValue ) {

       return "checked";
    } else {
       return "";
    }
 });

 expressHbs.registerHelper('today', () => {
   const today = moment().format('YYYY-MM-DD');
   console.log(today);
   return today;
 });

 expressHbs.registerHelper('travelsList', function(items, options) {
  var out = "<ul>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});
