var Buddy = require('../models/buddy.model');
var Category = require('../models/category.model')

// Display list of all buddies.
exports.buddy_list = function(req, res, next) {
    Buddy.find({}).populate('categories').exec(function (err, buddies) {
        if (err) return res.status(500).send({ err: err.errmsg});
        if (buddies === undefined) return res.status(404).send({ err: "There are no buddies at the moment!"});
        res.status(200).send(buddies);
    })
};

// Display detail page for a specific buddy.
exports.buddy_detail = function(req, res, next) {
    var id = req.params.id;
    Buddy.findById(id).populate('categories').exec(function (err, buddy) {
        if (err) return res.status(500).send({ err: err.errmsg });
        if (buddy === undefined) return res.status(404).send({ err: "Buddy not found!"});

        if(buddy.id === req.buddyId){
            //Attach categories for selecting in buddy profile
            Category.find(function (err, categories) {
                if (err || !categories) return res.status(500).send({ err: err.errmsg });
                //jsonArray = [{buddy: _buddy}, {categories: _categories}, {own: "modifyAndBreakEverything_LuL"}];
                var jsonArray = {buddy, categories, own: "modifyAndBreakEverything_LuL"};
                res.status(200).send(jsonArray);
            });
        }else{
            res.status(200).send(buddy);
        }
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
        if (err) return res.status(500).send({ err: err.errmsg});
        if (buddy === undefined) return res.status(404).send({ err: "Buddy not found!"});
        res.status(200).send(buddy);
    });
};

/* ONLY SELF*/
// Handle buddy update on PUT.
exports.buddy_update = function(req, res, next) {
    //IF not buddy BLOCK
    if(req.buddyId === undefined) return res.status(403).send({ err: "Forbidden"});
    
    //delete uneditable params
    if(req.body.moodle_id !== undefined) delete req.body.moodle_id;
    if(req.body.first_name !== undefined) delete req.body.first_name;
    if(req.body.last_name !== undefined) delete req.body.last_name;
    if(req.body.blocked !== undefined) delete req.body.blocked;
    if(req.body.available !== true && req.body.available !== false) delete req.body.available;
    if(req.body.away !== true && req.body.away !== false) delete req.body.away;
    
    Buddy.findOneAndUpdate(req.buddyId, req.body, {new: true}, function(err, buddy){
        if (err) return res.status(500).send({ err: err.errmsg});
        if (buddy === undefined) return res.status(404).send({ err: "Buddy not found!"});
        res.status(200).send(buddy);
    });
};