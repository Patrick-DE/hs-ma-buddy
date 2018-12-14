var Block = require('../models/block.model');

// Display list of all blocks.
exports.block_list = function(req, res) {
    Block.find(function (err, blocks) {
        if (err) return console.error(err);
        res.json(blocks);
    })
};

// Display detail page for a specific block.
exports.block_detail = function(req, res) {
    var id = req.params.id;
    Block.findById(id, function (err, block) {
        if (err) return console.error(err);
        res.json(block);
    })
};

// Handle block create on POST.
exports.block_create = function(req, res) {
    var newBlock = new Block({
        block_id: req.body.block_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
    })
    newBlock.save(function(err) {
        if (err) return console.error(err);
        req.send("Block " + start_time + " was added!");
    });
};

// Handle block delete on POST.
exports.block_delete = function(req, res) {
    Block.findByIdAndDelete(id, function(err, block){
        if (err) return console.error(err);
        res.send("Block " + block.start + " was deleted!");
    })
};

// Handle block update on POST.
exports.block_update = function(req, res) {
    Block.findByIdAndUpdate(id, req.body, function(err, block){
        if (err) return console.error(err);
        res.send("Block " + block.start + " was updated!");
    })
};