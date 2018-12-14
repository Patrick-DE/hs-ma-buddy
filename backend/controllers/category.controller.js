var Category = require('../models/category.model');

// Display list of all categories.
exports.category_list = function(req, res) {
    Category.find(function (err, categories) {
        if (err) return console.error(err);
        res.json(categories);
    })
};

// Display detail page for a specific category.
exports.category_detail = function(req, res) {
    var id = req.params.id;
    Category.findById(id, function (err, category) {
        if (err) return console.error(err);
        res.json(category);
    })
};

// Handle category create on POST.
exports.category_create = function(req, res) {
    var newCategory = new Category({
        category_id: req.body.category_id,
        name: req.body.name,
    })
    newCategory.save(function(err) {
        if (err) return console.error(err);
        req.send("Category " + newCategory.name + " was added!");
    });
};

// Handle category delete on POST.
exports.category_delete = function(req, res) {
    Category.findByIdAndDelete(id, function(err, category){
        if (err) return console.error(err);
        res.send("Category " + category.name + " was deleted!");
    })
};

// Handle category update on POST.
exports.category_update = function(req, res) {
    Category.findByIdAndUpdate(id, req.body, function(err, category){
        if (err) return console.error(err);
        res.send("Category " + category.name + " was updated!");
    })
};