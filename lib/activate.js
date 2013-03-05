var mongoose = require('mongoose')
,	UserModel = require('../models/user.js');

mongoose.connect('mongodb://localhost/devfolio');

var username = process.argv[2];
var password = process.argv[3];

UserModel.User.findOne({ username: username }, function(err, user) {
	if (err) console.log(err);
	user.password = password;
	user.is_active = true;
	user.save(function() {
		process.exit();
	});
});