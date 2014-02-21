var nodemailer = mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  content = require('../../config/content');

exports.index = function( req, res ) {
  if ( req.query.pass === process.env.NODE_EMAIL_PASS ) {
    Email.find(function( err, emails ) {
      if ( err ) {
        throw new Error(err);
      }

      res.render( 'list/index', {
        title: 'Email List &bull; ' + content.appname + ' ' + content.appsubname,
        emails: emails
      });
    });
  } else {
    res.redirect('/');
  }
};

