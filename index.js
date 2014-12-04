var express = require('express');
var exphbs = require('express-handlebars');
var parse = require('parse').Parse;
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');

var app = express();
var viewsFolder = __dirname + '/public/views';

// SDK's
parse.initialize(
  'CJzUVNSgyd8nZZ1OpT7DQJAaE1yV7SfMxDi2WG2d',
  'qrlaDjb5NiCJhPlgytvnGzNafI6vOBN6xGUNO37U'
);

// Directories
app.use(express.static(__dirname + '/public'));

// Body-Parser
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

// Engines
app.engine( 'handlebars', exphbs(
{
  defaultLayout : viewsFolder + '/layouts/master',
  layoutsDir    : viewsFolder + '/layouts',
  partialsDir   : viewsFolder + '/partials'
}) );
app.set('view engine', 'handlebars');
app.set('views', viewsFolder);

// Views
var viewFrontpage = require('./routes/home')(app, url);

// API's
var apiUser = require('./routes/api/user')(app, url, parse);

// Run Server
app.listen(3000);
