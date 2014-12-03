var App = App || {};

App.Parse = (function() {
  'use strict';

  function initialize() {
    Parse.initialize("CJzUVNSgyd8nZZ1OpT7DQJAaE1yV7SfMxDi2WG2d", "qrlaDjb5NiCJhPlgytvnGzNafI6vOBN6xGUNO37U");
  }

  function loginError( data ) {
    var errorInfo = {
      status: data.status.toString()
    };

    Parse.Analytics.track('login error', errorInfo)
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize,
    loginError: loginError
  };

})();
