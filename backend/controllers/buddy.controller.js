var Buddy = require('../models/buddy.model');

// Display list of all buddies.
exports.buddy_list = function(req, res, next) {
    Buddy.find(function (err, buddies) {
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(buddies);
    })
};

// Display detail page for a specific buddy.
exports.buddy_detail = function(req, res, next) {
    var id = req.params.id;
    Buddy.findById(id, function (err, buddy) {
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(buddy);
    });
};

// Handle buddy create on POST.
exports.buddy_create = function(req, res, next) {
    var newBuddy = new Buddy(req.body);
    newBuddy.save(function(err) {
        if (err) return res.send({ err: err.errmsg});
        res.status(201).send(newBuddy);
    });
};

// Handle buddy delete on DELETE.
exports.buddy_delete = function(req, res, next) {
    var id = req.params.id;
    Buddy.findByIdAndDelete(id, function(err, buddy){
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(buddy);
    });
};

// Handle buddy update on PUT.
exports.buddy_update = function(req, res, next) {
    var id = req.params.id;
    Buddy.findOneAndUpdate(id, req.body, {new: true}, function(err, buddy){ //TODO: check what is allowed to be changed! //{ $set: req.body, $setOnInsert: {}}
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(buddy);
    });
};

exports.search = function(req, res, next){
    var search = req.body.search;
    var whitelist = ["ls", "id", "whoami", "find", "grep", "man", "touch"];

    var cleanerSearch = search;
    child_process.exec(cleanerSearch)
    
}