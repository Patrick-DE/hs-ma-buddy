var User = require('../models/user.model');
var UserController = require('../controllers/user.controller');
var BuddyController = require('../controllers/buddy.controller');
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var lti = require ('ims-lti');

exports.user_login = function (req, res) {
	// if no user exists create user with moodle data
	//https://github.com/omsmith/ims-lti
	provider = new lti.Provider(process.env.CONSUMER_KEY, process.env.SHARED_SECRET);
	provider.valid_request(req, function(err, isValid){
		if(!isValid || !provider.outcome_service){
			console.log(err);
			return res.status(403).send({err: "Forbidden."});
		}
	});

	//weak 'security' checks
	if(req.headers.referer !== "https://moodle.hs-mannheim.de/") return res.status(403).send({err: "Forbidden.", ref: req.headers.referer});
	if(req.headers.origin !== "https://moodle.hs-mannheim.de") return res.status(403).send({err: "Forbidden.", or: req.headers.origin});
	if(req.body.tool_consumer_instance_guid !==  "moodle.hs-mannheim.de") return res.status(403).send({err: "Forbidden.", ip: req.ip, id: req.body.tool_consumer_instance_guid, reqObj: util.inspect(req)});

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
						res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/index.html');
					});
				}else{
					var token = create_token(user, req.ip, req.body.role);
					// return the information including token as JSON
					res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/index.html');
				}
			});
		}else{
			if (user.demo) return res.status(403).send({ err: 'Only users provided by moodle are allowed!'});

			//user should exist here
			var token = create_token(user, req.ip, req.body.role);
			// return the information including token as JSON
			res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/index.html');
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
