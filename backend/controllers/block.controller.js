var Block = require('../models/block.model');

// Display list of all blocks.
exports.block_list = function(req, res) {
    Block.find(function (err, blocks) {
        if (err) return console.error(err.errmsg);
        res.status(200).send(blocks);
    });
};

// Display detail page for a specific block.
exports.block_detail = function(req, res) {
    var id = req.params.id;
    Block.findById(id, function (err, block) {
        if (err) return console.error(err.errmsg);
        res.status(200).send(block);
    });
};

// Handle block create on POST.
exports.block_create = function(req, res) {
    var newBlock = new Block(req.body);
    newBlock.save(function(err) {
        if (err) return res.send(err.errmsg);
        res.status(201).send(newBlock);
    });
};

// Handle block delete on DELETE.
exports.block_delete = function(req, res) {
    var id = req.params.id;
    Block.findByIdAndDelete(id, function(err, block){
        if (err) return res.send(err.errmsg);
        res.status(200).send(block);
    });
};

// Handle block update on PUT.
exports.block_update = function(req, res) {
    var id = req.params.id;
    Block.findOneAndUpdate(id, req.body, {new: true}, function(err, block){
        if (err) return res.send(err.errmsg);
        res.status(200).send(block);
    });
};