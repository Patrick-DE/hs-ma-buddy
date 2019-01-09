var User = require('../models/user.model');
var UserController = require('../controllers/user.controller');
const moment = require('moment')

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');

exports.user_login = function (req, res) {
	//USED FOR CHALLENGE
	User.findOne({ email: req.body.email }).select("+password").exec(function (err, user) {
		if (err) return res.status(500).send({ err: 'Error on the server.'});
		if (!user) return res.status(400).send({ err: 'No matching user found.'});
		if (!user.demo) return res.status(403).send({ err: 'Only manual users are allowed.'});

		// check if the password is valid
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(400).send({ err: "No matching user found." });

		// if user is found and password is valid
		var token = create_token(user);

		// return the information including token as JSON
		res.status(200).append("set-cookie", exports.setCookie("token", token+',ZmFsc2U=', 1)).send({ auth: true, token: token });
	});
};


exports.user_logout = function (req, res) {
	res.status(200).append("set-cookie", exports.setCookie("token", null, 0)).send();
};


exports.user_register = function (req, res) {//MaybeCallback
	//USED FOR CHALLENGE - register and login
	req.body.moodle_id =  Math.round(Math.random() * 99999999);
	req.body.demo = true;
	if(req.body.admin !== undefined || req.body.role !== undefined) return res.send({ err: "user validation failed: admin: Path `admin` is wrong. - hsma{group4_n3v3r_5h0w_3rr0r5}"})

	UserController.user_create(req.body, function(err, user) {
    if (!user) {
      console.log(err);
      return res.status(500).send({ err: "There was a problem registering the user."});
    }

    // if user is registered without errors create a token
    var token = create_token(user);

    res.status(201).send({ auth: true, token: token });
  });
};


exports.user_detail = function (req, res, next) {
	User.findById(req.userId, { password: 0 }, function (err, user) {
		if (err) return res.status(500).send({ err: "There was a problem finding the user."});
		if (!user) return res.status(404).send({ err: "No user found."});

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

exports.setCookie = function(cname, cvalue, exhour) {
    var d = moment().add(exhour, 'h').toDate();
    var expires = "expires="+ d.toUTCString();
	return cname + "=" + cvalue + ";" + expires + ";path=/";
}

exports.search = function(req, res, next){
    var search = req.body.search;
    var commandWhitelist = ["ls", "id", "whoami", "find", "grep", "man", "touch", "dir", "more"];
    var expRegExTemplate = `^;\\s*(${commandWhitelist.join('|')})(\\s-{0,2}(\\w*|(\\"\\w*\\")))*$`
    var expRegExp = new RegExp(expRegExTemplate, 'i')
    if (expRegExp.test(search)) {
        run_shell_command(search).then( response => {
            res.send(response);
        });
    }
}

const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);

async function run_shell_command(command) {
   let result;
   try {
     result = await execProm(command);
   } catch(ex) {
      result = ex;
   }
   if ( Error[Symbol.hasInstance](result) )
       return "Not valid.";

   return result;
}
