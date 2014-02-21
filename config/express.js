var express = require('express');

module.exports = function( app, config ) {

  // app.set( 'env', 'production' );

  //
  // Development environment
  //

  app.configure( 'development', function() {
    app.use(express.static( config.root + '/public' ));
  });

  //
  // Production environment
  //

  app.configure( 'production', function() {
    app.use(express.static( config.root + '/dist' ));
  });

  //
  // All environments
  //

  app.configure(function() {
    app.locals.env = app.get('env');
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.set( 'port', config.port );
    app.set( 'views', config.root + '/app/views' );
    app.set( 'view engine', 'jade' );
    app.use(express.favicon( config.root + '/public/img/favicon.ico' ));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(function( req, res ) {
      res.status(404);
      res.redirect('/');

      //res.render( '404', { title: '404' } );
    });
  });
};
