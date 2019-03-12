var User = require('../models/user.model');
var VerifyToken = require('../verifyToken');

var bcrypt = require('bcryptjs');

/* INTERNAL*/
// RETURNS ALL THE USERS IN THE DATABASE
exports.user_list = function (req, res) {
    User.find(function (err, users) {
        if (err) return res.status(500).send({ err: "There was a problem finding the users."});
        res.status(200).send(users);
    });
};

/* INTERNAL - sendMessage()*/
// GETS A SINGLE USER FROM THE DATABASE
exports.user_detail = function (id, next) {
    User.findById(id, function (err, user) {
        next(err, user);
    });
};

/* INTERNAL*/
// creates user for register function
// if no pw set create random pw and send it back else delete pw
exports.user_create = function (body, callback) {
    var newUser = new User({
        first_name: body.lis_person_name_given,
        last_name: body.lis_person_name_family,
        moodle_id: body.user_id,
        email: body.lis_person_contact_email_primary,
        buddy: body.buddy,
    });

    User.create(newUser, function (err, user) {
        if (err || !user) return callback(err, null);
        callback(err, user);
    });
};

/* INTERNAL*/
// DELETES A USER FROM THE DATABASE
exports.user_delete = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send({ err: "There was a problem deleting the user."});
        res.status(200).send(user);
    });
};

/* INTERNAL*/
// UPDATES A SINGLE USER IN THE DATABASE
exports.user_update = function (req, callback) {
    User.findByIdAndUpdate(id, req.body, {new: true}, function (err, user) {
        if (err || !user) return callback(err, null);
        callback(err, user);
    });
};
