var User = require('../models/user.model');
var UserController = require('../controllers/user.controller');
var BuddyController = require('../controllers/buddy.controller');
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');

exports.user_login = function (req, res) {
	// if no user exists create user with moodle data
	console.log(req.hostname);
	/****************************************************/
	/*TODO: check for real identifier not fakable things*/
	const ipWhitelist = ["127.0.0.1", "::ffff:127.0.0.1", "localhost", process.env.MOODLE_IP];
	if(!ipWhitelist.includes(req.ip)) return res.status(403).send("Forbidden.");
	/****************************************************/
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

				if(req.body.roles === "Instructor"){
					BuddyController.buddy_create(req, res, function(err, buddy){
						if (err) {
							console.log(err)
							res.status(500).send({ err: 'Buddyprofile was not successfully created.'})
						}
						res.status(201).append("set-cookie", exports.setCookie("token", token, 1)).send({ auth: true, token: token });
					});
				}else{
					var token = create_token(user, req.ip, req.body.role);
					// return the information including token as JSON
					res.status(201).append("set-cookie", exports.setCookie("token", token, 1)).send({ auth: true, token: token });
				}
			});
		}else{
			if (user.demo) return res.status(403).send({ err: 'Only users provided by moodle are allowed!'});

			//user should exist here
			var token = create_token(user, req.ip, req.body.role);
			// return the information including token as JSON
			res.status(200).append("set-cookie", exports.setCookie("token", token, 1)).send({ auth: true, token: token });
		}
	});
};

exports.user_logout = function (req, res) {
	res.status(200).append("set-cookie", exports.setCookie("token", null, 0)).send();
};

exports.user_detail = function (req, res, next) {
	User.findById(req.userId, function (err, user) {
		if (err) return res.status(500).send({err: "There was a problem finding the user."});
		if (!user) return res.status(404).send({err: "No user found."});
		res.status(200).send(user);
	});
};

function create_token(user, ip, role){
	// create a token
	var isBuddy = false;
	if(role === "Instructor") isBuddy = true;
	var token = jwt.sign({ id: user._id, ip: ip, buddy: isBuddy}, process.env.SECRET, {
		expiresIn: Number(process.env.TOKEN_EXPIRE)*60*60//1h, 86400 expires in 24 hours
	});

	return token;
}

exports.setCookie = function(cname, cvalue, exhour) {
	var d = new Date();
	d.setTime(d.getTime() + (exhour*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	//TODO: set ";HttpOnly;secure" for https submit only_if productive
	return cname + "=" + cvalue + ";" + expires + ";path=/";
}
