var app = function(vimeoId) {

  //
  // Set application variables
  //

 var $load = $('#load'),
    $html = $('html'),
    $window = $(window),
    $about = $('#about'),
    $scene = $('#scene'),
    $prompt = $('#prompt'),
    $container = $('#container'),
    $header = $('header', $about),
    $email = $('input.email-input'),
    $statusmsg = $('p#status-message');

  var camera, scene, renderer,
    mesh, geometry, material,
    start_time = Date.now(),
    $clouds = $('.clouds'),
    numClouds = 500,
    far = 2000;

  //
  // Fade out loading screen
  //

  $load.fadeOut('slow');

  //
  // Hide mobile browser menu
  //

  setTimeout( function() {
    $window.scrollTop(0);
  }, 0 );

  //
  // Add touch functionality
  //

  FastClick.attach(document.body);

  if ( Hammer.HAS_TOUCHEVENTS ) {
    $container.hammer( { drag_lock_to_axis: true } );
    _.tap( $html, 'a,button,[data-tap]' );
  }

  $html.addClass( Hammer.HAS_TOUCHEVENTS ? 'touch' : 'mouse' );

  //
  // Resize handler
  //

  $window.on(
    'resize scroll',
    _.debounce(function() {
      var width = $window.width(),
        height = $window.height();

      $scene.width(width).height(height);
      $about.width(width).height(height);
      $prompt.width(width).height(height);

      var cw = $clouds.width(),
        ch = $clouds.height();

      camera.aspect = ( cw / ch );
      camera.updateProjectionMatrix();
      renderer.setSize( cw, ch );
    }, 200 )
  ).resize();

  //
  // Details
  //

  Visibility.onVisible(function() {
    setTimeout(function() {
      $about.removeClass('hide');
    }, 500 );

    setTimeout(function() {
      $( '#vid', $header ).html('<iframe src="//player.vimeo.com/video/' + vimeoId + '?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1" frameborder="0"></iframe>').fitVids();
    }, 1300 );
  });

  $email.verimail({
    messageElement: 'p#status-message'
  });

  $email.focus(function() {
    $statusmsg.fadeIn('slow');
  });

  $statusmsg.hide().click(function() {
    $email.focus();
  });

  $prompt.click(function() {
    $prompt.addClass('hide');
  });

  $('form#mail').submit(function( e ) {
    var email = $email.val(),
      url = 'mail/' + email;

    if ( email !== '' ) {
      $.get( url, function( data ) {
        if (data === 'mail sent') {
          $prompt.removeClass('hide');
        } else {
          mailfail();
        }
      }).fail(function() {
        mailfail();
      });
    }

    e.preventDefault();
  });

  function mailfail() {
    $( 'h2', $prompt ).text('Error registering!');
    $( 'p', $prompt ).text('Sorry! Try again after reloading the page.');
    $prompt.removeClass('hide');
  }

  //
  // Parralax
  //

  $scene.parallax();

  //---------------------------------------------------------------------------
  // Clouds (desktop only)
  //---------------------------------------------------------------------------

  if ( !Hammer.HAS_TOUCHEVENTS ) {

    function init() {
      camera = new THREE.PerspectiveCamera(
          30, // fov
          ( $(window).width() / $(window).height() ), // aspect
          1, // near
          far
        );

      camera.position.z = 6000;

      scene = new THREE.Scene();

      geometry = new THREE.Geometry();

      var texture = THREE.ImageUtils.loadTexture(
          '/img/cloud10.png',
          null,
          animate
        );

      var fog = new THREE.Fog(
          0x4584b4, // color
          -100, // near
          far
        );

      material = new THREE.ShaderMaterial({
        uniforms: {
          'map': { type: 't', value: texture },
          'fogColor' : { type: 'c', value: fog.color },
          'fogNear' : { type: 'f', value: fog.near },
          'fogFar' : { type: 'f', value: fog.far },
        },
        vertexShader: $('#vs').text(),
        fragmentShader: $('#fs').text(),
        depthWrite: false,
        depthTest: false,
        transparent: true
      });

      var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

      for ( var i = 0; i < numClouds; i++ ) {
        plane.position.x = ( Math.random() * 1000 - 500 );
        plane.position.y = ( -Math.random() * Math.random() * 200 + 180 );
        plane.position.z = i;
        plane.rotation.z = ( Math.random() * Math.PI );
        plane.scale.x = plane.scale.y = (
            Math.random() * Math.random() * 1.5 + 0.5
          );

        THREE.GeometryUtils.merge( geometry, plane );
      }

      mesh = new THREE.Mesh( geometry, material );
      scene.add(mesh);

      mesh = new THREE.Mesh( geometry, material );
      mesh.position.z = -numClouds;
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true
        });
      renderer.setSize( $clouds.width(), $clouds.height() );
      $clouds.append(renderer.domElement);
    }

    function animate() {
      requestAnimationFrame(animate);

      position = ( ( Date.now() - start_time ) * 0.03 );

      if ( Visibility.state() === 'hidden' || position > numClouds*2 ) {
        return;
      }

      camera.position.z = ( position - numClouds + 400 );

      renderer.render( scene, camera );
    }

    Visibility.onVisible(function() {
      init();
    });
  }
};

