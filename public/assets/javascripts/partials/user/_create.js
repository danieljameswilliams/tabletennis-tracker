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
