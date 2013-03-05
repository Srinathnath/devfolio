
/**
 * Module dependencies.
 */

var express = require('express')
,   http = require('http')
,   path = require('path')
,   flash = require('connect-flash')
,   passport = require('passport')
,   localStrategy = require('passport-local').Strategy
,   sessionHandler = require('./lib/session')
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
    app.set('hosted image url', __dirname+'/public/images');
    app.set('db url', 'mongodb://localhost/devfolio');
}

mongoose.connect(app.get('db url'));

/*
 * Set up Passport
 */
passport.serializeUser(sessionHandler.serialize);
passport.deserializeUser(sessionHandler.deserialize);
passport.use(sessionHandler.localStrategy);

/*
 * Load Routes
 */

var routes = require('./routes')({ app: app });

/*
 * Static Routes
 */
//app.get('/', sessionHandler.verifyNotLoggedIn, routes.index);
app.get('/', sessionHandler.verifyNotLoggedIn, routes.betaForm);
app.post('/', sessionHandler.verifyNotLoggedIn, routes.betaSignup);

/*
 * User creation routes
 */
/*app.get('/new_user', sessionHandler.verifyNotLoggedIn, routes.newUser);
app.post('/new_user', sessionHandler.verifyNotLoggedIn, routes.newUser);
app.post('/register', sessionHandler.verifyNotLoggedIn, routes.createUser);*/

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
app.post('/tmp/avatar', sessionHandler.verifyLoggedIn, routes.addAvatar);
app.post('/upload', sessionHandler.verifyLoggedIn, routes.uploadAvatar);
app.get('/:username', routes.folio);
app.post('/:username', sessionHandler.verifyLoggedIn, routes.editUser);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
