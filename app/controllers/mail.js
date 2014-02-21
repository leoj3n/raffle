var nodemailer = require('nodemailer'),
  mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  content = require('../../config/content');

exports.send = function( req, res ) {
  var email = new Email( { email: req.params.newEmail } );

  email.save(function( err ) {

    //
    // Abort if there was an error saving the email
    //

    if ( err ) {
      console.log(err);
      res.send(err);
      return;
    }

    //
    // Send confirmation if save was successful
    //

    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport(
      'SMTP', {
        host: content.emailhost,
        secureConnection: true,
        port: 465,
        auth: {
          user: content.emailuser,
          pass: process.env.NODE_EMAIL_PASS
        }
      });

    // setup e-mail data
    var mailOptions = {
        from: content.appname + ' <' + content.emailuser + '>',
        to: req.params.newEmail,
        subject: content.emailsubject,
        text: content.emailbodytext,
        html: content.emailbodyhtml
      };

    // send mail with defined transport object
    smtpTransport.sendMail( mailOptions, function( err, res ) {
      if ( err ) {
        console.log( 'sendmail error: ' + err );
      }

      // shut down the connection pool, no more messages
      smtpTransport.close();
    });
  });

  //
  // Send success message
  //

  res.send('mail sent');
};
