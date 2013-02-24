var mongoose = require('mongoose')
,	bcrypt = require('bcrypt')
,	SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, index: { unique: true }},
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true },
	description: { type: String },
	social: {
		email: {
			display: { type: Boolean, default: false }
		},
		github: {
			url: String,
			display: { type: Boolean, default: false }
		},
		twitter: {
			url: String,
			display: { type: Boolean, default: false }
		},
		linkedin: {
			url: String,
			display: { type: Boolean, default: false }
		}
	},
	avatar_url: String,
	linkedin_id: String,
	github_id: String,
	created_at: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports.User = User = mongoose.model('User', UserSchema);
module.exports.validateEmail = function(candidateEmail, cb) {
	User.findOne({ email: candidateEmail }, function(err, user) {
		if (err) return cb(err);
		return cb(user == null);
	});
}
module.exports.validateUsername = function(candidateUsername, cb) {
	User.findOne({ username: candidateUsername }, function(err, user) {
		if (err) return cb(err);
		return cb(user == null);
	});
}