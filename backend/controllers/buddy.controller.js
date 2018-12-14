var Buddy = require('../models/buddy.model');

// Display list of all buddies.
exports.buddy_list = function(req, res) {
    Buddy.find(function (err, buddies) {
        if (err) return console.error(err);
        res.json(buddies);
    })
};

// Display detail page for a specific buddy.
exports.buddy_detail = function(req, res) {
    var id = req.params.id;
    Buddy.findById(id, function (err, buddy) {
        if (err) return console.error(err);
        res.json(buddy);
    })
};

// Handle buddy create on POST.
exports.buddy_create = function(req, res) {
    var newBuddy = new Buddy({
        moodle_id: req.body.moodle_id,
        name: req.body.name,
        surename: req.body.surename,
        mobile: req.body.mobile,
        email: req.body.email,
    })
    newBuddy.save(function(err) {
        if (err) return console.error(err);
        req.send("Buddy " + newBuddy.name + " " + newBuddy.surename + " was added!");
    });
};

// Handle buddy delete on POST.
exports.buddy_delete = function(req, res) {
    Buddy.findByIdAndDelete(id, function(err, buddy){
        if (err) return console.error(err);
        res.send("Buddy " + buddy.name + " " + buddy.surename + " was deleted!");
    })
};

// Handle buddy update on POST.
exports.buddy_update = function(req, res) {
    Buddy.findByIdAndUpdate(id, req.body, function(err, buddy){
        if (err) return console.error(err);
        res.send("Buddy " + buddy.name + " " + buddy.surename + " was updated!");
    })
};