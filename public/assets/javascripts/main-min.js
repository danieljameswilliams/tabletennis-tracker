var App = App || {};
    App.Authentication = App.Authentication || {};

App.Authentication.Facebook = (function() {
  'use strict';

  var dom = {},
      selectors = {
        facebookID : '.js-facebook-id',
        accessToken: '.js-accesstoken'
      };

  function initialize() {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/da_DK/all.js', function() {
      FB.init({
        appId   : '839189926131224',
        xfbml   : true,
        version : 'v2.2'
      });
    });
  }

  function getLoginStatus( paramCallback ) {
    var callback = paramCallback || loginHandler;

    FB.getLoginStatus( callback );
  }

  function loginHandler( response ) {
    if( response.status == 'connected' ) {
      $( selectors.facebookID ).val( response.authResponse.userID );
      $( selectors.accessToken ).val( response.authResponse.accessToken );
    }
    else {
      FB.login(function( response ) {
        loginHandler( response );
      }, { scope: 'email, user_birthday, user_likes, read_stream' } );
    }
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize,
    getLoginStatus: getLoginStatus
  };

})();


/* **********************************************
     Begin _parse-analytics.js
********************************************** */

var App = App || {};

App.Parse = (function() {
  'use strict';

  function initialize() {
    $.getScript('//www.parsecdn.com/js/parse-1.3.2.min.js', function() {
      Parse.initialize(
        'CJzUVNSgyd8nZZ1OpT7DQJAaE1yV7SfMxDi2WG2d', // Application Key
        'qrlaDjb5NiCJhPlgytvnGzNafI6vOBN6xGUNO37U'  // JavaScript Key
      );
    });
  }

  function loginError( message ) {
    var errorInfo = {
      'message' : message.toString()
    };

    Parse.Analytics.track('error', errorInfo)
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize,
    loginError: loginError
  };

})();


/* **********************************************
     Begin _create.js
********************************************** */

var App = App || {};

App.SignUp = (function() {
  'use strict';

  var dom = {},
      selectors = {
        facebookLoginBtn : 'user-create__btn--facebook'
      };

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$submit = $('.js-user-create-btn');
    dom.$form = $('.js-user-create-form');
  }

  function _addEventListeners() {
    dom.$submit.on('click', _onSubmitClicked );
  }

  function _onSubmitClicked() {
    event.preventDefault();

    var $this = $(this);
    if( $this.hasClass( selectors.facebookLoginBtn ) ) {
      $.when( App.Authentication.Facebook.getLoginStatus() )
      .done( function() {
        _prepareAuthenticationWithRemote( $this );
      } );
    }
    else {
      _prepareAuthenticationWithRemote( $this );
    }
  }

  function _prepareAuthenticationWithRemote( $this ) {
    var $this = $this || $(this);

    if( $this.hasClass( selectors.facebookLoginBtn ) ) {
      FB.api('/me', { fields: 'name' }, function( response ) {
        $('input[name=\'name\']', dom.$form).val( response.name );
        $('input[name=\'username\']', dom.$form).val( response.id );
      });
    }

    var loginData = dom.$form.serializeArray();

    _authenticateWithRemote( loginData );
  }

  function _authenticateWithRemote( loginData ) {
    $.ajax({
      type: 'POST',
      url: dom.$form.attr('action'),
      data: loginData
    })
    .done(function( response ) {
      var data = $.parseJSON( response );

      /**
       * We are now waiting for some response from the server,
       * Which can return 3 types of string status:
       * [pending], [active] and [reserved].
       */
      if(data.status == 'pending' || data.status == 'active') {
        _loginSuccess();
      }
      else if (data.status == 'reserved') {
        alert('Der findes allerde en bruger med dette brugernavn');
      }
      else {
        App.Parse.loginError( data );
        alert('Der skete en fejl, supporten er underrettet.');
      }
    });
  }

  /**
   * Changes the UI to act logged in and personal.
   */
  function _loginSuccess() {
    dom.$form.html('Du er logget ind som: ' + data.Name);
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();


/* **********************************************
     Begin _login.js
********************************************** */

var App = App || {};

App.Login = (function() {
  'use strict';

  var dom = {},
      selectors = {
        facebookLoginBtn : 'facebook-login-btn'
      };

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$submit = $('.js-login-btn');
    dom.$form = $('.js-login-form');
  }

  function _addEventListeners() {
    dom.$submit.on('click', _onLoginSubmit );
  }

  function _onLoginSubmit() {
    event.preventDefault();

    var $this = $(this);
    if( $this.hasClass( selectors.facebookLoginBtn ) ) {

      $.when( App.Authentication.Facebook.getLoginStatus() )
       .done( _prepareAuthenticationWithRemote );
    }
    else {
      _prepareAuthenticationWithRemote( $this );
    }
  }

  function _prepareAuthenticationWithRemote( $this ) {
    var $this = $this || $(this);
    var loginData = dom.$form.serializeArray();

    _authenticateWithRemote( loginData );
  }

  function _authenticateWithRemote( loginData ) {
    $.ajax({
      type: 'POST',
      url: dom.$form.attr('action'),
      data: loginData
    })
    .done(function( response ) {
      var data = $.parseJSON( response );

      /**
       * We are now waiting for some response from the server,
       * Which can return 3 types of string status:
       * [pending], [active] and [incorrect].
       */
      if(data.status == 'pending' || data.status == 'active') {
        _loginSuccess();
      }
      else if (data.status == 'incorrect') {
        alert('Der findes ingen bruger med disse oplysninger.');
      }
      else {
        App.Parse.loginError( data.status );
        alert('Der skete en fejl, supporten er underrettet.');
      }
    });
  }

  /**
   * Changes the UI to act logged in and personal.
   */
  function _loginSuccess() {
    dom.$form.html('Du er logget ind som: ' + data.Name);
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();


/* **********************************************
     Begin _create.js
********************************************** */

var App = App || {};

// 1. Find the users in the database and store them.
// 2. Create a match, with the user relation.
// 3. Change the view to 'pending.handlebars'.
// 4. Prefill the input-fields in 'pending.handlebars'.
App.SignUp = (function() {
  'use strict';

  var dom = {},
      selectors = {
        facebookLoginBtn : 'facebook-create-btn',
        inputChallenger : '.js-challenger-input',
        inputChallenged : '.js-challenged-input'
      };

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$submit = $('.js-create-btn');
    dom.$form = $('.js-match-create-form');
    dom.$updateForm = $('.js-match-update-form');

    dom.$inputChallenger = $( selectors.inputChallenger );
    dom.$inputChallenged = $( selectors.inputChallenged );

    dom.$inputChallengerID = $('.js-challenger-id');
    dom.$inputChallengedID = $('.js-challenged-id');
  }

  function _addEventListeners() {
    dom.$form.on( 'submit', _onFormSubmit );

    dom.$inputChallenger.on( 'blur', _onInputBlur );
    dom.$inputChallenged.on( 'blur', _onInputBlur );
  }

  function _onFormSubmit() {
    event.preventDefault();

    var challenger = dom.$inputChallenger.val();
    var challenged = dom.$inputChallenged.val();

    var Match = Parse.Object.extend('Match');
    var match = new Match();

    match.set( 'challenger', { '__type' : 'Pointer', 'className' : '_User', 'objectId' : challenger } );
    match.set( 'challenged', { '__type' : 'Pointer', 'className' : '_User', 'objectId' : challenged } );
    match.set( 'finished', false );

    match.save(null, {
      success: function( match ) {
        console.log( match.id );
        $( selectors.inputChallenger, dom.$updateForm ).val( challenger );
        $( selectors.inputChallenged, dom.$updateForm ).val( challenged );
      },
      error: function( match, error ) {
        App.Parse.loginError( error.message );
        alert('Der skete en fejl, supporten er underrettet.');
      }
    });
  }

  function _onInputBlur () {
    var $this = $(this);
    var query = new Parse.Query( Parse.User );
    var userID = $this.attr('data-userid-field');

    query.equalTo( 'username', $this.val() );
    query.first({
      success: function( duellant ) {
        if( duellant !== undefined ) {
          $( '#' + userID ).val( duellant.id );
          $this.removeClass('user-not-found');
          $this.after( duellant.id );
        }
        else {
          $this.addClass('user-not-found');
        }
      }
    });
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();


/* **********************************************
     Begin main.js
********************************************** */

// @codekit-prepend "partials/_facebook-authentication.js"
// @codekit-prepend "partials/_parse-analytics.js"

// @codekit-prepend "partials/user/_create.js"
// @codekit-prepend "partials/user/_login.js"

// @codekit-prepend "partials/match/_create.js"

var App = App || {};

$(document).ready(function() {
  App.Authentication.Facebook.initialize();
  App.Parse.initialize();

  App.Login.initialize();
  App.SignUp.initialize();
});
