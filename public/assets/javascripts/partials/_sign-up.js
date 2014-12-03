var App = App || {};

App.SignUp = (function() {
  'use strict';

  var dom = {},
      selectors = {
        facebookLoginBtn : 'facebook-create-btn'
      };

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$signupSubmit = $('.js-create-btn');
  }

  function _addEventListeners() {
    dom.$signupSubmit.on('click', _onSignupSubmit );
  }

  function _onSignupSubmit() {
    event.preventDefault();

    console.log( 'Button Clicked' );

    var $this = $(this);
    if( $this.hasClass( selectors.facebookLoginBtn ) ) {
      console.log( 'Facebook Button Clicked' );

      $.when( App.Authentication.Facebook.getLoginStatus() )
       .done( _prepareAuthenticationWithRemote );
    }
    else {
      _prepareAuthenticationWithRemote( $this );
    }
  }

  function _prepareAuthenticationWithRemote( $this ) {
    var $this = $this || $(this);
    var parentForm = $this.parents('form');
    var loginData = parentForm.serializeArray();

    _authenticateWithRemote( loginData );
  }

  function _authenticateWithRemote( loginData ) {
    $.ajax({
      type: 'POST',
      url: '/services/user/login',
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
        console.log('Logger dig ind...');
      }
      else if (data.status == 'incorrect') {
        alert('Der findes ingen bruger med disse oplysninger.');
      }
      else {
        alert('Der skete en fejl, supporten er underrettet.');
        //TODO: Add Email Support Mail
      }
    });
    console.log('Checker dine data...');
  }

  /**
   * Changes the UI to act logged in and personal.
   */
  function _loginSuccess() {
    dom.$loginInput.val(data.Id);
    dom.$loginForm.html('Du er logget ind som: ' + data.Name);
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();