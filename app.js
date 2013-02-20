
/**
 * Module dependencies.
 */

var express = require('express')
,   routes = require('./routes')
,   http = require('http')
,   path = require('path')
,   flash = require('connect-flash')
,   passport = require('passport')
,   localStrategy = require('passport-local').Strategy
,   sessionHandler = require('./lib/session')
,   exec = require('child_process').exec
,   mongoose = require('mongoose');


var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

if (app.settings.env == 'development') {
     /*
      * Connect to local Mongo in dev
      */
    mongoose.connect('mongodb://localhost/devfolio');
}

/*
 * Set up Passport
 */
passport.serializeUser(sessionHandler.serialize);
passport.deserializeUser(sessionHandler.deserialize);
passport.use(sessionHandler.localStrategy);

/*
 * Static Routes
 */
app.get('/', sessionHandler.verifyNotLoggedIn, routes.index);

/*
 * User creation routes
 */
app.get('/new_user', sessionHandler.verifyNotLoggedIn, routes.registration);
app.post('/new_user', sessionHandler.verifyNotLoggedIn, routes.registration);
app.post('/register', sessionHandler.verifyNotLoggedIn, routes.createUser);

/*
 * Validation Routes
 */
app.post('/validate_email', routes.validateEmail);
app.post('/validate_username', routes.validateUsername);

/*
 * Session Management
 */
app.get('/login', sessionHandler.verifyNotLoggedIn, routes.getLoginForm);
app.post('/login', sessionHandler.verifyNotLoggedIn, sessionHandler.authenticate, routes.login);
app.get('/logout', routes.logout);

/*
 * User Dashboard and Editing Routes
 */
app.get('/dash', sessionHandler.verifyLoggedIn, routes.dash);

/*
 * Folio Routes
 */
app.get('/:username', routes.folio);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
