var path = require('path'),
    rootPath = path.normalize( __dirname + '/..' ),
    env = ( process.env.NODE_ENV || 'development' );

var config = {
  development: {
    root: rootPath,
    app: {
      name: process.env.APP_NAME
    },
    port: 3000,
    db: 'mongodb://localhost/' + process.env.APP_NAME + '-development'
  },

  test: {
    root: rootPath,
    app: {
      name: process.env.APP_NAME
    },
    port: 3000,
    db: 'mongodb://localhost/' + process.env.APP_NAME + '-test'
  },

  production: {
    root: rootPath,
    app: {
      name: process.env.OPENSHIFT_APP_NAME
    },
    port: process.env.OPENSHIFT_NODEJS_PORT,
    db: 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME
  }
};

module.exports = config[env];
