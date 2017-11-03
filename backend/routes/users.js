var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../localDB')['users'];

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  } else {
  	res.redirect('/login');
    // res.json("not authenticated");   
  }
}

/* GET users listing. */
router.get('/',
	isAuthenticated,
	function(req, res, next) {
 		res.render('users', {users: users});
	});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
router.get('/del/:id', function(req, res) {
  var userId = req.params.id,
      currentUser = req.user;

  users = users.filter(function(user){
      return user.id !== userId;
  });
  //if you delete yourself you will be logged out!
  if (userId === currentUser.id) {
    req.logout();
    return res.redirect('/');
  } 
  res.redirect('/users');
});
module.exports = router;
