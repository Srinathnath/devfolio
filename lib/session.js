var passport = require('passport')
,	LocalStrategy = require('passport-local').Strategy
,	UserModel = require('../models/user.js');

exports.verifyNotLoggedIn = function(req, res, next) {
	if (req.user)
		res.redirect('/dash');
	else
		next();
};

exports.verifyLoggedIn = function(req, res, next) {
	if (req.user)
		next();
	else
		res.redirect('/login');
}

exports.matchUsernames = function(req, res, next) {
	if (req.user.username === req.params.username)
		next();
	else
		res.redirect('/'+req.params.username)
}

exports.serialize = function(user, done) {
	done(null, user.id);
};

exports.deserialize = function(id, done) {
	UserModel.User.findById(id, function(err, user) {
		done(err, user);
	});
};

exports.localStrategy = new LocalStrategy( 
	{ usernameField: 'email' },
	function(email, password, done) {
		UserModel.User.findOne({email: email}, function(err, user) {
			if (!user)
				return done(null, false, { message: 'Incorrect Email or Password.' });

			if (user) {
				user.comparePassword(password, function(err, isMatch) {
					if (isMatch)
						return done(null, user);
					else
						return done(null, false, { message: 'Incorrect Email or Password.' });
				});
			}
			
		});
	}
);

exports.authenticate = passport.authenticate('local', {
		successRedirect: '/dash'
	,	failureRedirect: '/login'
	,	failureFlash: true
});
