var Category = require('../models/category.model');

// Display list of all categories.
exports.category_list = function(req, res) {
    Category.find(function (err, categories) {
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(categories);
    });
};

// Display detail page for a specific category.
exports.category_detail = function(req, res) {
    var id = req.params.id;
    Category.findById(id, function (err, category) {
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(category);
    });
};

// Handle category create on POST.
exports.category_create = function(req, res) {
    var newCategory = new Category(req.body);
    newCategory.save(function(err) {
        if (err) return res.send({ err: err.errmsg});
        res.status(201).send(newCategory);
    });
};

// Handle category delete on DELETE.
exports.category_delete = function(req, res) {
    var id = req.params.id;
    Category.findByIdAndDelete(id, function(err, category){
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(category);
    });
};

// Handle category update on PUT.
exports.category_update = function(req, res) {
    var id = req.params.id;
    Category.findOneAndUpdate(id, req.body, {new: true}, function(err, category){  //TODO: check what is allowed to be changed! //{ $set: req.body, $setOnInsert: {}}
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(category);
    });
};