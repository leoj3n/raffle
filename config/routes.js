module.exports = function( app ) {

  // home route
  var home = require('../app/controllers/home');
  app.get( '/', home.index );

  // mail route
  var mail = require('../app/controllers/mail');
  app.get( '/mail/:newEmail', mail.send );

  // email list route
  var list = require('../app/controllers/list');
  app.get( '/list', list.index );

};
