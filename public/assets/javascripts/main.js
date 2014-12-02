// @codekit-prepend "partials/_login.js"
// @codekit-prepend "partials/_facebook-authentication.js"

var App = App || {};

$(document).ready(function() {
  App.Login.initialize();
  App.Authentication.Facebook.initialize();
});
