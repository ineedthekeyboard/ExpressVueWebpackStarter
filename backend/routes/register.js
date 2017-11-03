const crypto = require('crypto');
var base64url = require('base64url');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
var users = require('../localDB')['users'];

router.get('/', function(req, res, next) {
	var errorMessage = null,
		flashMessage = req.flash('error')[0];
	if (flashMessage) {
		errorMessage = {err: flashMessage};
	}
  res.render('register', errorMessage);
});
router.post('/',
	function(req, res, next) {
		var username = req.body.username,
			password = req.body.password,
			randomId, user, userExists = false;

		//Check if account exists
		userExists = (users.filter(function(user){
			return user.email === username;
		}).length > 0);

		if (userExists) {
			res.render('register', {err: 'User Already Exists'});
		} else {
			//Add User to *DB*
			randomId = base64url(crypto.randomBytes(8));
			user = {
				id: randomId,
				email: username,
				password: password
			};
			users.push(user);
			req.login(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/users');
			});
		}
	}
);

module.exports = router;