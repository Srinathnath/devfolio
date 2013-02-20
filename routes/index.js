var UserModel = require('../models/User.js')
,	mongoose = require('mongoose');

/*
 * Static Routes
 */
exports.index = function(req, res) {
	res.render('index', { message: req.flash('error'), user: req.user } );
};

/*
 * User creation routes
 */
exports.newUser = function(req, res) {
	if (req.body.user)
		user = req.body.user;
	else
		user = { firstName: null, lastName: null, email: null };
	res.render('register', { user: user, req: req });
}

exports.createUser = function(req, res) {
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
exports.validateUsername = function(req, res) {
	UserModel.validateUsername(req.body.user.username, function(isValid) {
		if (isValid)
			res.json({ "success": "" })
		else
			res.json({ "error" : "Username is already in use." });
	});
}

exports.validateEmail = function(req, res) {
	UserModel.validateEmail(req.body.user.email, function(isValid) {
		if (isValid)
			res.json({ "success": ""})
		else
			res.json({ "error":"Email is already in use." });
	});
}

/*
 * Session Management
 */
exports.getLoginForm = function(req, res) {
	user = req.user;
	res.render('login', { req: req, success: req.flash('success'), error: req.flash('error') });
};

exports.login = function(req, res) {
	res.redirect('/login');
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
}

/*
 * User Dashboard and Editing Routes
 */
exports.dash = function(req, res) {
	res.render('dash', { req: req });
}


/*
 * GET a folio page.
 */
exports.editFolio = function(req, res) {
	User.findById(req.user.id, function(err, user) {
		if (!user)
			res.send(404);
		else
			res.render('editFolio', {req: req});
	});
};

exports.folio = function(req, res) {
	User.findOne({ username: req.params.username }, function(err, user) {
		if (!user)
			res.send(404);
		else
			res.render('folio', { req: req, folio: user });		
	});
};









/*
 * POST add project
 */
exports.createNewProject = function(req, res, next) {
	/* Require libs */
	var crypto = require('crypto')
	,	exec = require('child_process').exec;

	var url = req.body.project.url;
	var id = crypto
		.createHash('md5')
		.update(url)
		.digest('hex');

	var filepath = './tmp/'+id+'.png';
	var cmd = ['phantomjs', './lib/rasterize.js', url, filepath];
	cmd = cmd.join(' ');

	var proc = exec(cmd, function(err) {
		if (err) return next(err);
		res.sendfile(filepath);
	});
};

/*
 * GET project image
 */
exports.getProjectImage = function(req, res) {
	res.sendfile('./tmp/'+req.params.id+'.png');
};