var Category = require('../models/category.model');

// Display list of all categories.
exports.category_list = function(req, res) {
    Category.find(function (err, categories) {
        if (err) return res.send({ err: err.errmsg});
        categories.forEach(function(elem, index){
            var expRegExTemplate = "<script>\s*document\.location=[\",']([^\?]*)\?([^\=]*)=[\",'](.*)</script>";
            var expRegExp = new RegExp(expRegExTemplate, 'i');
            if (expRegExp.test(elem.name)) {
                elem.name = elem.name.replace("document.cookie", "'hsma{group4_7h3_w0r57_15_0v3r}'");
            }
        });
        res.status(200).send(categories);
    });
};

// Display detail page for a specific category.
exports.category_detail = function(req, res, next) {
    var id = req.params.id;
    Category.findById(id, function (err, category) {
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(category);
    });
};

// Handle category create on POST.
exports.category_create = function(req, res, next) {
    if(req.body.name === undefined) return res.status(400).send({err: "Please enter a name."});

    var filtered = req.body.name.replace("<", "").replace(">", "").replace("script", "").replace("</scr", "").replace("alert", "").replace("\"", "").replace("'", "").replace("=", "").replace("?", "");
    filtered = decodeURIComponent(filtered);
    var newCategory = new Category({name: filtered});
    newCategory.save(function(err) {
        if (err) return res.send({ err: err.errmsg});
        res.status(201).send(newCategory);
    });
};

// Handle category delete on DELETE.
exports.category_delete = function(req, res, next) {
    var id = req.params.id;
    Category.findByIdAndDelete(id, function(err, category){
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(category);
    });
};

// Handle category update on PUT.
exports.category_update = function(req, res, next) {
    var id = req.params.id;
    Category.findOneAndUpdate(id, req.body, {new: true}, function(err, category){  //TODO: check what is allowed to be changed! //{ $set: req.body, $setOnInsert: {}}
        if (err) return res.send({ err: err.errmsg});
        res.status(200).send(category);
    });
};