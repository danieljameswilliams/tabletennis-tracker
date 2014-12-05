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
