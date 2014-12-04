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
