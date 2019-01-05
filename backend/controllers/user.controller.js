var User = require('../models/user.model');
var VerifyToken = require('../verifyToken');

var bcrypt = require('bcryptjs');

// RETURNS ALL THE USERS IN THE DATABASE
exports.user_list = function (req, res) {
    User.find(function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
};

// GETS A SINGLE USER FROM THE DATABASE
exports.user_detail = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
};

// creates user for register function
// if no pw set create random pw and send it back else delete pw
exports.user_create = function (body, callback) {
    var generatedPass = false;
    var tmpPass = "";
    var newUser = new User({
        first_name: body.lis_person_name_given,
        last_name: body.lis_person_name_family,      
        moodle_id: body.user_id,
        email: body.lis_person_contact_email_primary
    });
    
    if(body.password === undefined){
        generatedPass = true;
        tmpPass = Math.random().toString(36).substr(2, 8);
    }else{
        tmpPass = body.password;
    }
        
    newUser.password = bcrypt.hashSync(tmpPass, 7);

    User.create(newUser, function (err, user) {
        //if generatedPassword return it
        if(generatedPass) user.password = tmpPass;

        callback(err, user);
    });
};

// DELETES A USER FROM THE DATABASE
exports.user_delete = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send(user);
    });
};

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
exports.user_update = /* VerifyToken, */ function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
};