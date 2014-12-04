module.exports = function( app, url, parse ) {

  app.post('/api/user/create', function( request, response ) {
  });

  app.post('/api/user/login', function( request, response ) {
    var facebookid  = request.body.facebookid;
    var accesstoken = request.body.accesstoken;
    var username    = request.body.username;
    var password    = request.body.password;

    if ( facebookid.length > 0 ) {
      username = facebookid;

      Parse.FacebookUtils.init({
        appId      : '839189926131224',
        status     : true,
        cookie     : true,
        xfbml      : true
      });


    }
    else {
      parse.User.logIn( username, password, {
        success: function( user ) {
          // Do stuff after successful login.
        },
        error: function( user, error ) {
          // The login failed. Check error to see why.
        }
      });
    }

    console.log( 'User Logging in' );
  });

}
