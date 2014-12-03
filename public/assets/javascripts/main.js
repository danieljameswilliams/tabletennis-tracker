// @codekit-prepend "partials/_facebook-authentication.js"
// @codekit-prepend "partials/_parse-analytics.js"
// @codekit-prepend "partials/_login.js"
// @codekit-prepend "partials/_sign-up.js"

var App = App || {};

$(document).ready(function() {
  App.Authentication.Facebook.initialize();
  App.Parse.initialize();
  App.Login.initialize();
  App.SignUp.initialize();
});
