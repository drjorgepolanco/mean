/*\
 * -----------------------------------------------------------------------------
 * Modules
 * -------
\*/

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

/*\
 * -----------------------------------------------------------------------------
 * Configuration
 * -------------
\*/

var db = require('./config/db');
var port = process.env.PORT || 3000;

// connect to our mongoDB database
// mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. 
// simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

/*\
 * -----------------------------------------------------------------------------
 * Routes
 * ------
\*/

require('./app/routes')(app);

/*\
 * -----------------------------------------------------------------------------
 * Start App
 * ---------
\*/

app.listen(port, function() {
  console.log('Listening on port %d', port);
});

module.exports = app;