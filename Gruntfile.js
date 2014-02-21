'use strict';

var request = require('request');

module.exports = function( grunt ) {

  //
  // Show elapsed time at the end
  //

  require('time-grunt')(grunt);

  //
  // Load all grunt tasks
  //

  require('load-grunt-tasks')(grunt);

  //
  // Initialize configuration
  //

  var reloadPort = 35729,
    files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      dev: {
        src: 'env.json'
      }
    },
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: [ 'develop', 'delayed-livereload' ]
      },
      pubjs: {
        files: [ 'public/js/*.js' ],
        options: { livereload: reloadPort }
      },
      sass: {
        files: [ 'public/sass/**/*.sass' ],
        tasks: [ 'sass' ],
        options: { livereload: reloadPort }
      },
      jade: {
        files: [ 'app/views/**/*.jade' ],
        options: { livereload: reloadPort }
      }
    },
    clean: {
      dist: [
        'dist'
      ]
    },
    jadeUsemin: {
      dist: {
        options: {
          uglify: true,
          prefix: 'public/'
        },
        files: {
          src: [ 'app/views/**/*.jade' ]
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          cache: false,
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'public/',
          src: ['img/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },
    sass: {
      dev: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/app.css': 'public/sass/styles.sass'
        }
      }
    }
  });

  //
  // Delayed livereload task
  //

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask(
    'delayed-livereload',
    'Live reload after the node server has restarted.',
    function() {
      var done = this.async();

      setTimeout(function() {
        request.get(
          'http://localhost:'+reloadPort+'/changed?files='+files.join(','),
          function( err, res ) {
            var reloaded = ( !err && res.statusCode === 200 );

            console.log(reloaded);

            if ( reloaded ) {
              grunt.log.ok('Delayed live reload successful.');
            } else {
              grunt.log.error('Unable to make a delayed live reload.');
            }

            done(reloaded);
          });
      }, 500 );
    }
  );

  //
  // Main tasks
  //

  grunt.registerTask(
    'default', [
      'env',
      'develop',
      'watch'
    ]);

  grunt.registerTask(
    'dist', [
      'sass',
      'clean',
      'jadeUsemin',
      'imagemin'
    ]);
};
