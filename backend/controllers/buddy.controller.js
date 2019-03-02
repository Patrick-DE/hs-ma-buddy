var Buddy = require('../models/buddy.model');

// Display list of all buddies.
exports.buddy_list = function(req, res, next) {
    Buddy.find(function (err, buddies) {
        if (err) return res.send({ err: err.errmsg});
        if (buddies === undefined) res.status(404).send({ err: "There are no buddies at the moment!"});
        res.status(200).send(buddies);
    })
};

// Display detail page for a specific buddy.
exports.buddy_detail = function(req, res, next) {
    var id = req.params.id;
    Buddy.findById(id, function (err, buddy) {
        if (err) return res.send({ err: err.errmsg });
        if (buddy === undefined) res.status(404).send({ err: "Buddy not found!"});
        res.status(200).send(buddy);
    });
};

/* INTERNAL*/
// Handle buddy create on POST.
exports.buddy_create = function(req, res, next) {
    var newBuddy = new Buddy({
        moodle_id: req.body.user_id,
        first_name: req.body.lis_person_name_given,
        last_name: req.body.lis_person_name_family
    });
    newBuddy.save(function(err) {
        next(err, newBuddy);
    });
};

/* ONLY BUDDY*/
// Handle buddy delete on DELETE.
exports.buddy_delete = function(req, res, next) {
    //IF not buddy BLOCK
    if(req.buddy === false) return res.status(403).send({ err: "Forbidden"});

    var id = req.params.id;
    Buddy.findByIdAndDelete(id, function(err, buddy){
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(buddy);
    });
};

/* INTERNAL*/
// Handle buddy update on PUT.
exports.buddy_update = function(req, res, next) {
    var id = req.params.id;
    Buddy.findOneAndUpdate(id, req.body, {new: true}, function(err, buddy){ //TODO: check what is allowed to be changed! //{ $set: req.body, $setOnInsert: {}}
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(buddy);
    });
};