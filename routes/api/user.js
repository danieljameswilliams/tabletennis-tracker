module.exports = function( app, url, parse ) {

  app.post('/api/user/signup', function( request, response ) {
  });

  app.post('/api/user/login', function( request, response ) {
    var facebookid = request.body.facebookid;
    var username   = request.body.username;
    var password   = request.body.password;

    if ( facebookid.length > 0 ) {
      username = facebookid;
    }

    parse.User.logIn( username, password );

    console.log( 'User Logging in' );
  });

}
