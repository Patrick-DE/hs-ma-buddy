var Buddy = require('../models/buddy.model');

// Display list of all buddies.
exports.buddy_list = function(req, res) {
    Buddy.find(function (err, buddies) {
        if (err) return res.send(err.errmsg);
        res.json(buddies);
    })
};

// Display detail page for a specific buddy.
exports.buddy_detail = function(req, res) {
    var id = req.params.id;
    Buddy.findById(id, function (err, buddy) {
        if (err) return res.send(err.errmsg);
        res.json(buddy);
    })
};

// Handle buddy create on POST.
exports.buddy_create = function(req, res) {
    var newBuddy = new Buddy(req.body);
    newBuddy.save(function(err) {
        if (err) return res.send(err.errmsg);
        res.send(newBuddy);
    });
};

// Handle buddy delete on DELETE.
exports.buddy_delete = function(req, res) {
    var id = req.params.id;
    Buddy.findByIdAndDelete(id, function(err, buddy){
        if (err) return res.send(err.errmsg);
        res.send(buddy);
    })
};

// Handle buddy update on PUT.
exports.buddy_update = function(req, res) {
    var id = req.params.id;
    Buddy.findOneAndUpdate(id, req.body, function(err, buddy){ //TODO: check what is allowed to be changed!
        if (err) return res.send(err.errmsg);
        res.send(buddy);
    })
};