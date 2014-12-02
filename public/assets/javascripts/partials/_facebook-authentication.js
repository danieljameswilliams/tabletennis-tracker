var App = App || {};
    App.Authentication = App.Authentication || {};

App.Authentication.Facebook = (function() {
  'use strict';

  var dom = {};

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

  function getLoginStatus() {
    console.log( 'Facebook Login Status' );

    FB.getLoginStatus( loginHandler );
  }

  function loginHandler( response ) {
    console.log( 'Facebook Login Handler' );
    if( response.status == 'connected' ) {
      console.log( response );
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
