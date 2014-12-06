var App = App || {};

$(document).ready(function() {
  App.Authentication.Facebook.initialize();
  App.Parse.initialize();

  App.Login.initialize();
  App.SignUp.initialize();
});
