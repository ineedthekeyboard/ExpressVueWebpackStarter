var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');

router.get('/', function(req, res, next) {
	var errorMessage = null,
		flashMessage = req.flash('error')[0];
	if (flashMessage) {
		errorMessage = {err: flashMessage};
	}
  res.render('login', errorMessage);
});
router.post('/auth',
  passport.authenticate('local', { successRedirect: '/users',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);


module.exports = router;
