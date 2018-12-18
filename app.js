const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
var cors = require('cors');

// Init App
const app = express();
app.use(cors())
// Bring in Models
//let Article = require('./models/article');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Passport Config
//require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
//app.use(passport.session());
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);
app.use('/events', authCheckMiddleware);

// Route Files
const authRoutes = require('./routes/auth.js');
const apiRoutes = require('./routes/api.js');
const eventsRoutes = require('./routes/events');
const testget = require('./routes/testget');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/events', eventsRoutes);
// localhost/testget - nie jest zabezpieczony przed niezalogowanym użytkownikiem
// do tego trzeba użyc middleware 'authCheckMiddleware' - tak jak wyżej z /api
app.use('/testget', testget);

// Start Server
app.listen(4000, function(){
  console.log('Server started on port 4000...');
});
