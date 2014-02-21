var content = require('../../config/content');

exports.index = function( req, res ) {
  res.render( 'home/index', {
    title: 'Raffle &bull; ' + content.appname + ' ' + content.appsubname,
    appName: content.appname,
    appSubName: content.appsubname,
    loadingText: content.loadingtext,
    keywords: content.keywords,
    emailUser: content.emailuser,
    vimeoId: content.vimeoid
  });
};
