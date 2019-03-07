var User = require('../models/user.model');
var Buddy = require('../models/buddy.model');
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
	if(process.env.NODE_ENV === "production"){
		//https://github.com/omsmith/ims-lti/
		var provider = new lti.Provider(process.env.CONSUMER_KEY, process.env.SHARED_SECRET);
		provider.valid_request(req, function(err, isValid){
			if(!isValid || !provider.outcome_service){
				console.log(err);
				return res.status(403).send({err: "Forbidden."});
			}
			//weak 'security' checks
			if(req.headers.referer !== "https://moodle.hs-mannheim.de/") return res.status(403).send({err: "Forbidden.", ref: req.headers.referer});
			if(req.headers.origin !== "https://moodle.hs-mannheim.de") return res.status(403).send({err: "Forbidden.", or: req.headers.origin});
			if(req.body.tool_consumer_instance_guid !==  "moodle.hs-mannheim.de") return res.status(403).send({err: "Forbidden.", ip: req.ip, id: req.body.tool_consumer_instance_guid, reqObj: util.inspect(req)});
			
			User.findOne({ moodle_id: req.body.user_id }, function (err, user) {
				if (err) {
					console.log(err);
					return res.status(500).send({ err: 'Error on the server.'});
				}
		
				//user does not exists yet
				if (!user) {
					//check if user is buddy
					if(req.body.roles === "Instructor"){
						//create buddy
						BuddyController.buddy_create(req, res, function(err, buddy){
							if (err || !buddy){ 
								console.log(err);
								return res.status(500).send({ err: 'Buddyprofile was not successfully created.'});
							}
							req.body.buddy = buddy.id;
							//create user with buddy detail
							UserController.user_create(req.body, function (err, user){
								if (err || !user){ 
									console.log(err);
									return res.status(500).send({ err: 'There was a problem registering a buddy user.'})
								}
		
								var token = create_token(user, req.ip, user.buddy);
								// return the information including token as JSON
								res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/dashboard.html');
							});
						});
					}else{
						UserController.user_create(req.body, function (err, user){
							if (err || !user){ 
								console.log(err);
								return res.status(500).send({ err: 'There was a problem registering the user.'})
							}
		
							var token = create_token(user, req.ip, user.buddy);
							// return the information including token as JSON
							res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/dashboard.html');
						});
					}
				//user should exist here
				}else{
					//if buddy profile does not yet exist create
					if(req.body.roles === "Instructor" && user.buddy === undefined){
						//create buddy
						Buddy.buddy_create(req, res, function(err, buddy){
							if (err || !buddy){ 
								console.log(err);
								return res.status(500).send({ err: 'Buddyprofile was not successfully created.'});
							}
							//add buddy.id to user
							UserController.user_update({buddy: buddy.id}, function (err, user){
								if (err || !user){ 
									console.log(err);
								 	return res.status(500).send({ err: 'There was a problem updating your user.'})
								}
		
								var token = create_token(user, req.ip, user.buddy);
								// return the information including token as JSON
								res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/dashboard.html');
							});
						});
					}else{
						var token = create_token(user, req.ip, user.buddy);
						//return the information including token as JSON
						res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/dashboard.html');
					}
				}
			});
		});
	}else{
		//DEMO/TEST LOGIN W/O AUTH
		User.findOne({ moodle_id: req.body.user_id }, function (err, user) {
			if (err) {
				console.log(err)
				res.status(500).send({ err: 'Error on the server.'})
				return
			}
	
			if (!user) {
				if(req.body.roles === "Instructor"){
					BuddyController.buddy_create(req, res, function(err, buddy){
						if (err || !buddy){ 
							console.log(err);
							return res.status(500).send({ err: 'Buddyprofile was not successfully created.'});
						}
						req.body.buddy = buddy.id;
	
						UserController.user_create(req.body, function (err, user){
							if (err || !user){ 
								console.log(err);
								return res.status(500).send({ err: 'There was a problem registering the user.'})
							}
	
							var token = create_token(user, req.ip, user.buddy);
							// return the information including token as JSON
							res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/dashboard.html');
						});
					});
				}else{
					UserController.user_create(req.body, function (err, user){
						if (err || !user){ 
							console.log(err);
							return res.status(500).send({ err: 'There was a problem registering the user.'})
						}
	
						var token = create_token(user, req.ip, user.buddy);
						// return the information including token as JSON
						res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/dashboard.html');
					});
				}
			}else{
				//user should exist here
				var token = create_token(user, req.ip, user.buddy);
				// return the information including token as JSON
				res.status(302).append("set-cookie", exports.setCookie("token", token, 1)).redirect('/dashboard.html');
			}
		});
	}
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

function create_token(user, ip, buddy_id){
	// create a token
	var token = jwt.sign({ id: user._id, ip: ip, buddy_id: buddy_id}, process.env.SECRET, {
		expiresIn: Number(process.env.TOKEN_EXPIRE)*60*60//1h, 86400 expires in 24 hours
	});

	return token;
}

exports.setCookie = function(cname, cvalue, exhour) {
	var d = new Date();
	d.setTime(d.getTime() + (exhour*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	if(process.env.NODE_ENV === "production")
		return cname + "=" + cvalue + ";" + expires + ";path=/;HttpOnly;secure";
	else
		return cname + "=" + cvalue + ";" + expires + ";path=/";
}
