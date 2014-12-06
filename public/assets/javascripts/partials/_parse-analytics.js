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
