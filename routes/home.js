module.exports = function( app, url ) {

  app.get('/', function ( request, response ) {
    response.render('home');
  });

}
