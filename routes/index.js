var UserModel = require('../models/User.js')
,	mongoose = require('mongoose');

var routes = function(params) {
	app = params.app;

	/*
	 * Static Routes
	 */
	routes.index = function(req, res) {
		res.render('index', { message: req.flash('error'), user: req.user } );
	};

	/*
	 * User creation routes
	 */
	routes.newUser = function(req, res) {
		if (req.body.user)
			user = req.body.user;
		else
			user = { firstName: null, lastName: null, email: null };
		res.render('register', { user: user, req: req });
	};

	routes.createUser = function(req, res) {
		var user = req.body.user;
		if (!user)
			res.redirect('/new_user');

		// Validate the email and username
		UserModel.validateEmail(user.email, function(isValid) {
			if (!isValid) {
				req.flash('error', 'Email is already in use.')
				res.redirect('/new_user');
			} else {
				UserModel.validateUsername(user.username, function(isValid) {
					if (!isValid) {
						req.flash('error', 'Username is already in use.')
						res.redirect('/new_user');
					} else {
						user = new UserModel.User(user);
						user.save(function(err) {
							if (err) console.log(err);
							req.flash('success', 'You are set! Go ahead and log in with your credentials.');
							res.redirect('/login');
						});
					}
				});
			}
		});
	};

	/*
	 * Validation Routes
	 */
	routes.validateUsername = function(req, res) {
		UserModel.validateUsername(req.body.user.username, function(isValid) {
			if (isValid)
				res.json({ "success": "" })
			else
				res.json({ "error" : "Username is already in use." });
		});
	};

	routes.validateEmail = function(req, res) {
		UserModel.validateEmail(req.body.user.email, function(isValid) {
			if (isValid)
				res.json({ "success": ""})
			else
				res.json({ "error":"Email is already in use." });
		});
	};

	/*
	 * Session Management
	 */
	routes.getLoginForm = function(req, res) {
		user = req.user;
		res.render('login', { req: req, success: req.flash('success'), error: req.flash('error') });
	};

	routes.login = function(req, res) {
		res.redirect('/login');
	};

	routes.logout = function(req, res) {
		req.logout();
		res.redirect('/');
	};

	/*
	 * User Dashboard and Editing Routes
	 */
	routes.dash = function(req, res) {
		res.render('dash', { req: req });
	};


	/*
	 * User routes
	 */
	routes.folio = function(req, res) {
		User.findOne({ username: req.params.username }, function(err, user) {
			if (!user)
				res.send(404);
			else {
				// Allow users to edit their own pages.
				editingEnabled = typeof(req.user) != 'undefined' && req.user.id === user.id;
				res.render('folio', { req: req, folio: user, editingEnabled: editingEnabled});		
			}
		});
	};

	routes.editUser = function(req, res) {
		User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
			res.json(user);
		});
	}

	return routes;
}

module.exports = routes;