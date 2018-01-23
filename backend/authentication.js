const crypto = require('crypto');

//Important Crypto Constants
const iterations = 50;
const keySize = 2048;
var authentication = {};

authentication.basicAuthStrategey = async function(username, password, done) {
	var userExists, user, users = require('./localDB')['users'], isCorrect;
	try {
	    if (!username) {
	      return done(null, false, { message: 'Incorrect username.' }); //Don't actually use different messages in production
	    }
	    if (!password) {
	      return done(null, false, { message: 'Incorrect password.' }); //Don't actually use different messages in production
	    }
	    userExists = (users.filter(function(user){
	      return user.email === username;
	    }).length > 0);


	    if (userExists) {
	      user = users.filter(function(user){
	        return user.email === username;
	      })[0];
	      //Verify username and pass
	      debugger;
	      isCorrect = await authentication.compareHash(password, user.salt, user.password);
	      if (isCorrect) {
	        return done(null, user);
	      } else { //Failed verification check
	        return done(null, false, { message: 'Incorrect username or password.' });
	      }
	    } else { //User does not exist: failed
	      return done(null, false, { message: 'User does not exist.' });
	    }
	} catch (err) {
		done(err, null);
	}
};
authentication.serializeSession = function(user, done) {
  done(null, user.id);
};

authentication.deSerializeSession = function(userId, done) {
  var users = require('./localDB')['users'];
  var user = users.filter(function(user){
        return user.id === userId;
      })[0] || {};
  done(null, user);
};
authentication.generateSecureHash = async function(passwordPlain) {
	return new Promise(async function(resolve, reject){
		try {
			var salt = crypto.randomBytes(keySize).toString('base64'), hash;
			var hash = await authentication.calculateHash(passwordPlain, salt);
			hash = hash.toString('base64');
			resolve({salt: salt, hash: hash});
		} catch (err) {
			reject(err);
		}
	});
}
authentication.calculateHash = function(passwordPlain, salt) {
	return new Promise(function(resolve, reject){
		crypto.pbkdf2(passwordPlain, salt, iterations, keySize, 'sha512', (err, derivedKey) => {
		  if (err) {
		  	reject(err);
		  }
		  hash = derivedKey.toString('base64');
		  resolve(hash);
		});
	});
}
authentication.compareHash = async function(passwordPlain, saltFromDB, hashFromDB) {
	return new Promise(async function(resolve, reject){
		try {
			var inComingHash = await authentication.calculateHash(passwordPlain, saltFromDB);
			inComingHash = inComingHash.toString('base64');
			if (hashFromDB === inComingHash) {
				resolve(true);
			} else {
				resolve(false);
			}
		} catch (err) {
			reject(err);
		}
	});
}
module.exports = authentication;