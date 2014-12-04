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
