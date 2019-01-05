var User = require('../models/user.model');
var UserController = require('../controllers/user.controller');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');

exports.user_login = function (req, res) {
	//USED FOR CHALLENGE
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No matching user found.');
		if (!user.demo) return res.status(403).send('Only manual users are allowed.');

		// check if the password is valid
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

		// if user is found and password is valid
		var token = create_token(user);

		// return the information including token as JSON
		res.status(200).send({ auth: true, token: token });
	});
};


exports.user_logout = function (req, res) {
	res.status(200).send({ auth: false, token: null });
};


exports.user_register = function (req, res) {//MaybeCallback
	//USED FOR CHALLENGE - register and login
	req.body.moodle_id = 666666;
	req.body.demo = true;

	UserController.user_create(req.body, function(err, user) {
    if (!user) {
      console.log(err);
      return res.status(500).send("There was a problem registering the user`.");
    }

    // if user is registered without errors create a token
    var token = create_token(user);

    res.status(200).send({ auth: true, token: token });
  });
};


exports.user_detail = function (req, res, next) {
	User.findById(req.userId, { password: 0 }, function (err, user) {
		if (err) return res.status(500).send("There was a problem finding the user.");
		if (!user) return res.status(404).send("No user found.");
		delete user.password;
		res.status(200).send(user);
	});
};


function create_token(user){
	// create a token
	var token = jwt.sign({ id: user._id }, process.env.SECRET, {
		expiresIn: 86400 //expires in 24 hours
	});

	return token;
}
