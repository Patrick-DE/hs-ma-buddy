var User = require('../models/user.model');
var UserController = require('../controllers/user.controller');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');

exports.user_login = function (req, res) {
	// if no user exists create user with moodle data
	console.log(req.hostname);
	//TODO: check for real identifier not fakable things
  const hostnameWhitelist = ["127.0.0.1", "localhost", "moodle.hs-mannheim.de"]
	if(!hostnameWhitelist.includes(req.hostname)) return res.status(403).send("Forbidden.");
	if(req.body.tool_consumer_instance_guid !==  "moodle.hs-mannheim.de") return res.status(403).send("Forbidden.");

	User.findOne({ moodle_id: req.body.user_id }, function (err, user) {
		if (err) {
		  console.log(err)
      res.status(500).send({ err: 'Error on the server.'})
      return
	  }

		if (!user) {
			UserController.user_create(req.body, function (err, user){
        if (err) {
          console.log(err)
          res.status(500).send({ err: 'Error on the server.'})
          return
        }
				if (!user) return res.status(500).send("There was a problem registering the user.");

				//user should exist here
				var token = create_token(user, req.ip);
				// return the information including token as JSON
				res.status(201).send({ auth: true, token: token, user: user});
			});
		}else{
			if (user.demo) return res.status(403).send({ err: 'Only users provided by moodle are allowed!'});

			//user should exist here
			var token = create_token(user, req.ip);
			// return the information including token as JSON
			res.status(200).send({ auth: true, token: token, user: user });
		}
	});
};

exports.user_logout = function (req, res) {
	res.status(200).send({ auth: false, token: null });
};

exports.user_detail = function (req, res, next) {
	User.findById(req.userId, function (err, user) {
		if (err) return res.status(500).send({err: "There was a problem finding the user."});
		if (!user) return res.status(404).send({err: "No user found."});
		res.status(200).send(user);
	});
};

function create_token(user, ip){
	// create a token
	var token = jwt.sign({ id: user._id, ip: ip}, process.env.SECRET, {
		expiresIn: 3600//1h, 86400 expires in 24 hours
	});

	return token;
}
